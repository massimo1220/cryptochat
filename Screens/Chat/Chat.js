import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  LogBox,
  Modal,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Vibration,
} from 'react-native';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import Message from '../../Components/Message/Message';
import Conversation from '../../Components/Conversation/Conversation';
import ConversationTab from '../../Components/ConversationTab/ConversationTab';
import NewMessageButton from '../../Components/NewMessageButton/NewMessageButton';
import NewConversation from '../../Components/NewConversation/NewConversation';
import showDeleteConversationMenu from '../../Components/DeleteConversationMenu/DeleteConversationMenu';
import * as firebase from 'firebase';
import * as constants from '../../Constants/Constants';
import 'firebase/firestore';
import 'firebase/auth';
import _ from 'lodash';
import nacl from 'tweet-nacl-react-native-expo';
import * as Constants from '../../Constants/Constants';
import DeleteConversationMenu from '../../Components/DeleteConversationMenu/DeleteConversationMenu';

import BannerAd from '../../Components/Banner/BannerAd';

LogBox.ignoreAllLogs();

const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class Chat extends Component {
  _isMounted = false;

  state = {
    conversations: [],
    newMessages: [],
    user: null,
    selectedConversation: null,
    conversationToDelete: null,
    showConversation: false,
    showNewConversation: false,
    showDeleteConversationMenu: false,
    refreshing: false,
    loadingFonts: true,
    loadingMessages: true,
    updating: false,
    error: null,
  };


  componentDidMount = async () => {
    this._isMounted = true;
    await Font.loadAsync({
      'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });
    this.setState({ loadingFonts: false });
    firebase.auth().onAuthStateChanged(async user => {
      if(user) { 
        this.setState({ user })
        await this.getMessages(user);
        this.setState({ loadingMessages: false });
      } else {
        const { replace } = this.props.navigation;
        replace('Login');
      }
    });
  }
  
  updateNewMessageCount = async (messages) => {
    const newMessages = this.state.newMessages.map((msg) => msg);
    messages.forEach((msg) => {
      const existingCounter = newMessages.find((counter) => counter.from === msg.from);
      if(existingCounter) {
        existingCounter.count++;
      } else {
        newMessages.push({ from: msg.from, count: 1 });
      }
    });
    await this.setState({ newMessages });
  }

  getMessages = async (user) => {
    try{
      this.setState({ updating: true });
      const { email } = user;
      const inboxSnap = await firebase.firestore().collection('users').doc(email).collection('inbox').get();
      const inbox = await inboxSnap.docs.map((doc) => doc.data());
      if(inbox.length > 0) {
        const messages = await this.decryptMessages(inbox);
        await this.updateNewMessageCount(messages);
        await this.saveNewMessages(messages);
        await this.deleteInbox(inboxSnap);
        await this.regenerateKeys(email);
        this.vibrate();
      }
      const builtMessages = await this.buildMessages();
      if((builtMessages.length > 0 && this.state.conversations.length === 0) || inbox.length) {
        const conversations = await this.buildConversations(builtMessages);
        this.setState({ conversations });
      }
      this.setState({ updating: false });
    } catch(error) {
        this.setState({ updating: false, error: 'Si è verificato un problema durante il recupero dei nuovi messaggi' });
    }
  };

  regenerateKeys = async (email) => {
      const publicKey = await this.handleKeyGeneration(email);
      await firebase.firestore().collection('availableUsers').doc(email).set({ publicKey });
  }

  handleKeyGeneration = async (email) => {
    const keyPair = await nacl.box.keyPair();
    const { publicKey, secretKey } = keyPair;
    const publicEncoded = nacl.util.encodeBase64(publicKey);
    const privateEncoded = nacl.util.encodeBase64(secretKey);
    const keys = { publicKey: publicEncoded, secretKey: privateEncoded };
    const stringySaved = await SecureStore.getItemAsync(email.replace('@', ''));
    const savedProfile = JSON.parse(stringySaved);
    savedProfile.keys = keys;
    await SecureStore.setItemAsync(email.replace('@', ''), JSON.stringify(savedProfile));
    return publicEncoded;
  }

  decryptMessages = async (messages) => {
    try{
      const { email } = this.state.user;
      let profile = await SecureStore.getItemAsync(email.replace('@', ''));
      if(profile !== null) {
        profile = JSON.parse(profile);
        let { secretKey } = profile.keys;
        secretKey = nacl.util.decodeBase64(secretKey);
        const decryptedMessages = messages.map((message) => {
          let { publicKey, nonce } = message;
          publicKey = nacl.util.decodeBase64(publicKey);
          nonce = nacl.util.decodeBase64(nonce);
          const sharedKey = nacl.box.before(publicKey, secretKey);
          const decodedMessage = nacl.util.decodeBase64(message.contents);
          const decrypted = nacl.box.open.after(decodedMessage, nonce, sharedKey);
          const utfMessage = nacl.util.encodeUTF8(decrypted);
          const parsedMessage = JSON.parse(utfMessage);
          const sentDate = new Date(parsedMessage.sent);
          const sentSeconds = Math.floor(sentDate.getTime() / 1000);
          parsedMessage.sent = { seconds: sentSeconds };        
          return parsedMessage;
        });
        return decryptedMessages;
      }
    } catch(error) { this.setState({ error: 'There was a problem decrypting your new message(s)'}) }
  }
  
  buildMessages = async () => {
    try{
      const { user } = this.state;
      const stringySavedMessages = await SecureStore.getItemAsync(user.email.replace('@', ''));
      const savedMessages = await JSON.parse(stringySavedMessages);
      const { inbox, sent } = savedMessages;
      if(!inbox.length && !sent.length) {
        return [];
      } else if(!sent.length) {
        return this.sortMessages(inbox);
      } else if(!inbox.length) {
        return this.sortMessages(sent);
      } else {
        const msgs = [...inbox, ...sent];
        return this.sortMessages(msgs);
      }
    } catch(err) { this.setState({ error: 'There was a problem displaying your messages, please restart the application' })}
  }
  
  buildConversations = (messages) => {
    const { email } = this.state.user;
    const sortedMessages = messages.reduce((conversations, curMessage) => {
      const existingConvo = conversations.findIndex((convo) => {
        if(convo.from == curMessage.from) {
          return true;
        }
        if(convo.from === curMessage.to) {
          return true;
        }
      });
      if(existingConvo > -1 && curMessage.from !== undefined) {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent }
        conversations[existingConvo].messages.push(newMessage);
      } else if(existingConvo > -1 && curMessage.to !== undefined) {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent, sender: true }
        conversations[existingConvo].messages.push(newMessage);
      } else if(curMessage.from !== undefined) {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent };
        const newConvo = {
          from: curMessage.from,
          messages: [newMessage],
        };
        conversations.push(newConvo);
      } else {
        const newMessage = { contents: curMessage.contents, timestamp: curMessage.sent, sender: true }
        const newConvo = {
          from: curMessage.to,
          messages: [newMessage],
        };
        conversations.push(newConvo);
      }
      return conversations;
    }, []);
    return sortedMessages;
  }

  sortMessages = (messages) => {
    messages.sort((a, b) => a.sent.seconds > b.sent.seconds);
    return messages;
  }

  saveNewMessages = async (messages) => {
    try {
      const { user } = this.state;
      const { email } = user;
      const stringySavedMessages = await SecureStore.getItemAsync(email.replace('@', ''));
      if(stringySavedMessages !== null) {
        const savedMessages = JSON.parse(stringySavedMessages);
        const savedInbox = savedMessages.inbox;
        savedMessages.inbox = [...savedInbox, ...messages];
        await SecureStore.setItemAsync(email.replace('@', ''), JSON.stringify(savedMessages));
      } 
    } catch(err) { this.setState({ error: 'There was a problem when trying to save a new message' }) }
  }

  deleteInbox = (inboxSnap) => {
    inboxSnap.docs.forEach((msg) => msg.ref.delete());
  }

  renderConversationTabs = () => {
    const { conversations, newMessages } = this.state;
    return conversations.map((convo) => {
      const newMessagesCount = this.getConvoNewMessageCount(convo.from, newMessages);
      let time;
      if(convo.messages.length) {
        const timestamp = convo.messages[convo.messages.length - 1].timestamp;
        time = this.formatTimestamp(timestamp);
      } else {
        time = 'New';
      }
      return (
        <ConversationTab 
          from={convo.from} 
          time={time} 
          key={convo.from} 
          updateSelectedConversation={this.updateSelectedConversation}
          handleConversationTabLongPress={this.handleConversationTabLongPress}
          newMessageCount={newMessagesCount}
        />
      );
    });
  }

  
  getConvoNewMessageCount = (friend, newMessages) => {
    const index = newMessages.findIndex((newMessage) => newMessage.from == friend);
    if(index > -1) {
      return newMessages[index].count;
    }
    return 0;
  }
  
  handleConversationTabLongPress = (from) => {
    const { conversations } = this.state;
    const conversationToDelete = conversations.find((convo) => convo.from === from);
    this.setState({ 
      conversationToDelete,
      showDeleteConversationMenu: true,
    });
  }
  
  toggleDeleteConversationMenu = () => {
    const { showDeleteConversationMenu } = this.state;
    this.setState({ showDeleteConversationMenu: !showDeleteConversationMenu });
  }
  
  renderMessages = () => {
    return this.state.messages.map((message, i) => {
      return (
        <Message key={i} message={message.contents} timestamp={message.sent} />
        );  
      });
    }
    
    renderConversation = () => {
      const { selectedConversation, user } = this.state;
      return (
        <Conversation
          from={selectedConversation.from}
          messages={selectedConversation.messages}
          user={user}
          updateConversation={this.updateConversation}
          closeSelectedConversation={this.closeSelectedConversation}
          deleteMessage={this.deleteMessage}
        />
      );
    } 
    
    toggleNewConversation = () => {
      this.setState({ showNewConversation: !this.state.showNewConversation });
    }
    
    updateConversation = (from, newMessage) => {
      const conversations = this.state.conversations.map((convo) => convo);
      const conversation = conversations.find((convo) => convo.from === from);
      if(!conversation) {
        return;
      }
      conversation.messages.push(newMessage);
      this.setState({ conversations });
    }
    
    formatTimestamp = (timestamp) => {
      const date = new Date(timestamp.seconds * 1000);
      let hours = Number(date.getHours());
      const label = (hours >= 12) ? 'PM': 'AM';
      let minutes = Number(date.getMinutes());
      if(hours > 12) {
        hours = hours - 12;
      } else if(hours === 0) {
        hours = 12;
      }
      if(minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${hours}:${minutes} ${label}`;
    }
    
    updateSelectedConversation = (from) => {
      const {conversations} = this.state;
      const conversation = conversations.find((convo) => convo.from === from);
      const updatedNewMessages = this.clearNewMessageCount(from);
      if(updatedNewMessages) {
        this.setState({ newMessages: updatedNewMessages, selectedConversation: conversation, showConversation: true});
        return;
      }
      this.setState({ selectedConversation: conversation, showConversation: true });
    }
    
    clearNewMessageCount = (friend) => {
      const newMessages = this.state.newMessages.map((count) => count);
      const friendCounter = newMessages.find((counter) => counter.from == friend);

      if(friendCounter) {
        return newMessages.filter((counter) => counter.from != friend);
      }

      return null;
    }

    handleNewConversation = (receiver) => {
      const conversations = this.state.conversations.map((convo) => convo);
      const existingConvo = conversations.find((convo) => convo.from === receiver);
    if(existingConvo) {
      this.setState({
        selectedConversation: existingConvo,
        showConversation: true,
        showNewConversation: false,
      })
    } else {
      const newConversation = {
        from: receiver,
        messages: [],
      }
      conversations.unshift(newConversation);
      this.setState(
        { 
          conversations, 
          selectedConversation: newConversation, 
          showConversation: true, 
          showNewConversation: false,
        }
      );
    }
  }

  deleteConversation = async () => {
    const { conversationToDelete, conversations, user } = this.state;
    const toDeleteFrom = conversationToDelete.from;
    const updatedConversations = conversations.filter((convo) => convo.from !== toDeleteFrom);
    let storedMessages = await SecureStore.getItemAsync(user.email.replace('@', ''));
    storedMessages = JSON.parse(storedMessages);
    storedMessages.inbox = storedMessages.inbox.filter((msg) => msg.from !== toDeleteFrom);
    storedMessages.sent = storedMessages.sent.filter((msg) => msg.to !== toDeleteFrom);
    await SecureStore.setItemAsync(user.email.replace('@', ''), JSON.stringify(storedMessages));
    this.setState({ conversations: updatedConversations, showDeleteConversationMenu: false, conversationToDelete: null });
  }

  deleteMessage = async (from, contents, isSender) => {
    const { conversations, user } = this.state;
    const conversation = conversations.find((convo) => convo.from === from);
    const messageIndex = conversation.messages.findIndex((message) => message.contents === contents);
    conversation.messages.splice(messageIndex, 1);
    this.setState({ conversations });
    let savedMessages = await SecureStore.getItemAsync(user.email.replace('@', ''));
    savedMessages = JSON.parse(savedMessages);
    if(isSender) {
      savedMessages.sent = savedMessages.sent.filter((msg) => msg.contents !== contents);
    } else {
      savedMessages.inbox = savedMessages.inbox.filter((msg) => msg.contents !== contents);
    }
    await SecureStore.setItemAsync(user.email.replace('@', ''), JSON.stringify(savedMessages));
  }

  closeSelectedConversation = () => {
    this.setState({ selectedConversation: null, showConversation: false });
  }

  errorTimeout = () => {
    setTimeout(() => {
      this.setState({ error: null });
    }, 5000);
  }

  vibrate = (pattern = [100, 100, 100, 100, 500, 500]) => {
    Vibration.vibrate(pattern);
  }

  // TODO: Fix memory leak 
  // componentWillUnmount() {
  //   this._isMounted = false;
  // }
  //   componentWillUnmount() {
  //   fix Warning: Can't perform a React state update on an unmounted component
  //     this.setState = (state,callback)=>{
  //         return;
  //     };
  // }

  render() {
    const { loadingMessages, refreshing, updating, user, showDeleteConversationMenu, selectedConversation, conversations, loadingFonts, error } = this.state;
    const { navigate } = this.props.navigation;
    
    if(!selectedConversation && !refreshing && !updating ) {
      setTimeout(async () => {
        await this.getMessages(user);
      }, 15000);
    }

    if(error) {
      this.errorTimeout();
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        { error && <Text style={styles.error}>{error}</Text> }
        <ActivityIndicator 
          animating={loadingMessages} 
          size="large" 
          color={Constants.tertiaryBgColor}
          style={{ position: 'absolute', top: '35%', left: '47.5%', zIndex: 5 }}
        />
        <Modal 
          visible={this.state.showDeleteConversationMenu} 
          animationType="slide" transparent={true}
        >
          <DeleteConversationMenu 
            toggleDeleteConversationMenu={this.toggleDeleteConversationMenu} 
            deleteConversation={this.deleteConversation}  
          />
        </Modal>
        { conversations.length > 0 && (
          <ScrollView
            refreshControl= {
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => this.getMessages(user)} 
                title='Refresh Messages'
                colors={[Constants.primaryBgColor, Constants.primaryHeaderColor]}
                progressBackgroundColor={Constants.tertiaryBgColor}
              />
            }
          >
              {this.state.user && this.renderConversationTabs()}
          </ScrollView>
        )}
        { (conversations.length === 0 && !loadingFonts && !loadingMessages) && (
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>Nessuna conversazione</Text>
            <Text style={styles.subNoMessagesText}>Premi il tasto aggiungi per iniziare una chat</Text>
          </View>
        )}
        <NewMessageButton toggleNewConversation={this.toggleNewConversation}/>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showConversation}
          onRequestClose={() => {
            this.setState({ showConversation: false });
          }}
        >
          {this.state.selectedConversation && this.renderConversation()}
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showNewConversation}
          onRequestClose={() => {
            this.setState({ showNewConversation: false });
          }}
        >
          <NewConversation 
            handleNewConversation={this.handleNewConversation} 
            toggleNewConversation={this.toggleNewConversation}
            email={ user !== null ? user.email : null }
          />
        </Modal>

        <BannerAd/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: constants.primaryBgColor,
  },
  noMessagesContainer: {
    height: Dimensions.get('window').height * .4,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  noMessagesText: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'exo-regular',
    color: 'white',
  },
  subNoMessagesText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'exo-regular',
  },
  error: {
    paddingTop: 18,
    color: 'orange',
    fontSize: 16,
    textAlign: 'center',
  },  
});
