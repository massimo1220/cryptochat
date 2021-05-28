import React, { Component } from 'react';
import { 
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import Message from '../Message/Message';
import ComposeMessageForm from '../ComposeMessageForm/ComposeMessageForm';
import BackButton from '../BackButton/BackButton';
import * as Constants from '../../Constants/Constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class Conversation extends Component {
  renderMessages = () => {
    const { messages, deleteMessage } = this.props;
    return messages.map((message, i) => {
      return (
        <Message 
          key={i} 
          content={message.contents} 
          timestamp={message.timestamp}
          isSender={message.sender === true ? true: false}
          deleteMessage={this.handleDeleteMessage}
        />
      );  
    });
  }

  handleDeleteMessage = async (content, isSender) => {
    const { deleteMessage, from } = this.props;
    await deleteMessage(from, content, isSender);
  }

  render() {
    const { from, messages, updateConversation, closeSelectedConversation } = this.props;
    const { email } = this.props.user;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BackButton close={closeSelectedConversation} />
          <Text style={styles.header}>{from}</Text>
        </View>
        <View style={styles.messagesContainer}>
          <ScrollView contentContainerStyle={{ display: 'flex' }}>
            { this.renderMessages() }
          </ScrollView>
        </View>
        <ComposeMessageForm from={email} to={from} updateConversation={updateConversation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').height * .1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: getStatusBarHeight(true) + 50,
    backgroundColor: Constants.primaryHeaderColor,
    padding: Constants.baseMarginPadding,
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    paddingTop: getStatusBarHeight(true),
  },
  header: {
    color: 'white',
    fontSize: 24,
    width: '90%',
    textAlign: 'center',
    fontFamily: 'exo-regular',
  },
  messagesContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .8,
  }
});

