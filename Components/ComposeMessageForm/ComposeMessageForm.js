import React, { Component } from 'react';
import { 
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Keyboard,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase';
import 'firebase/firestore';
const lock = require('../../assets/lock.png');
import * as constants from '../../Constants/Constants';
import nacl from 'tweet-nacl-react-native-expo';

export default class ComposeMessageForm extends Component {
  state = {
    message: '',
    focused: false,
  }

  handleChange = (message) => {
    this.setState({ message });
  }
  
  getPublicKey = async (email) => {
    try {
      const user = await firebase.firestore().collection('availableUsers').doc(email).get();
      if(user.exists) {
        return user.data().publicKey;
      }
      return false;
    } catch(error) { return false }
  }

  encryptMessage = async (newMessage) => {
    try {
      const { to, from } = this.props;
      let profile = await SecureStore.getItemAsync(from.replace('@', ''));
      profile = JSON.parse(profile);
      const secretKeyEncoded = profile.keys.secretKey;
      const secretKey = nacl.util.decodeBase64(secretKeyEncoded);
      let publicKey = await this.getPublicKey(to);
      if(!publicKey) {
        alert('Could not encrypt message, sending canceled')
        return;
      }
      publicKey = nacl.util.decodeBase64(publicKey);
      const sharedKey = nacl.box.before(publicKey, secretKey);
      const stringyMessage = JSON.stringify(newMessage);
      const decodedMessage = new Uint8Array(nacl.util.decodeUTF8(stringyMessage));
      const nonce = await nacl.randomBytes(24);
      const encrypted = nacl.box.after(decodedMessage, nonce, sharedKey);
      const base64Message = nacl.util.encodeBase64(encrypted);
      return {
        contents: base64Message,
        nonce: nacl.util.encodeBase64(nonce),
        publicKey: profile.keys.publicKey,
      }
    } catch(error) { alert('There was a problem encrypting your message') }
  }

  sendMessage = async () => {
    try {
      const { message } = this.state;
      if(!message) return;
      const { from, to, updateConversation } = this.props;
      const sent = new Date();
      const sentSeconds = Math.floor(sent.getTime() / 1000);
      const newMessage = {
        from,
        contents: message,
        sent,
      };
      const sentMessage = {
        to,
        contents: message,
        sent: { seconds: sentSeconds },
      };
      const encryptedMessage = await this.encryptMessage(newMessage);
      if(!encryptedMessage) {
        alert('Could not send message, user not found!');
        this.setState({ message: '' });
        return;
      }
      await firebase.firestore().collection('users').doc(to).collection('inbox').add(encryptedMessage);
      Keyboard.dismiss();
      this.setState({message: '', focused: false });
      updateConversation(to, { contents: message, timestamp: { seconds: sentSeconds }, sender: true });
      await this.saveSentMessage(sentMessage);
    } catch(error) { alert('Could not send message, try again later') }
  }

  saveSentMessage = async (newMessage) => {
    const { from } = this.props;
    try{
      const stringySavedMessages = await SecureStore.getItemAsync(from.replace('@', ''));
      const savedMessages = JSON.parse(stringySavedMessages);
      savedMessages.sent.push(newMessage);
      await SecureStore.setItemAsync(from.replace('@', ''), JSON.stringify(savedMessages));
    } catch(err) { alert('There was a problem saving your sent message') }   
  }
  
  render() {
    const { focused } = this.state;
    return (
      <View style={focused ? styles.keyboardContainer : styles.container}>
        <TextInput 
          style={styles.input} 
          onChangeText={this.handleChange} 
          value={this.state.message} 
          placeholder="Invia messaggio criptato"   
          placeholderTextColor="#A6A5AD"        
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
        />
        <TouchableOpacity style={styles.sendBtnContainer} onPress={this.sendMessage}>
          <Image source={lock} style={{width: 22, height: 22, backgroundColor: '#222222'}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .9,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    height: 40,
    top: Dimensions.get('window').height - 70,
    zIndex: 5,
    borderRadius: 50,
  },
  keyboardContainer: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .9,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    height: 40,
    top: Dimensions.get('window').height * .48,
    zIndex: 5,
    borderRadius: 50,
  },
  input: {
    width: '80%',
    textAlign: 'left',
    paddingLeft: 15,
    fontSize: 18,
  },
  sendBtnContainer: {
    backgroundColor: '#222222',
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: 50,
    width: '12%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: 26
  }
});

