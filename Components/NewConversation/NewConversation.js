import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import BackButton from '../BackButton/BackButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Constants from '../../Constants/Constants';


export default class NewConversation extends Component {
  state = {
   to: '',
  }

  handleNewConversation = async () => {
    const { to } = this.state;
    const { handleNewConversation, email } = this.props;
    if(!to) return;
    try {
      const lowercaseTo = to.toLowerCase();
      
      if(lowercaseTo === email) {
        alert('You cant send messages to yourself');
        return;
      }

      const user = await firebase.firestore().collection('availableUsers').doc(lowercaseTo).get();
      if(!user.exists) {
        alert('No user found with that email!');
        this.setState({ to: '' });
        return;
      }

      handleNewConversation(lowercaseTo);
    } catch(err) { alert('There was a problem starting the converstion') }
  }

  closeNewConversation = () => {
    const { toggleNewConversation } = this.props;
    toggleNewConversation();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BackButton close={this.closeNewConversation} />
        </View>
        <Text style={styles.headerText}>Inizia conversazione</Text>
        <Text style={styles.subtitleText}>incolla l'email dalla lista amici</Text>
        <TextInput style={styles.input} value={this.state.to} onChangeText={(value) => this.setState({to: value })} placeholder="Email" placeholderTextColor='#ccc'/>
        <TouchableOpacity style={styles.button} onPress={this.handleNewConversation}>
          <Text style={styles.text}>Inizia conversazione</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
    paddingTop: getStatusBarHeight(),
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: Dimensions.get('window').height * .075,
    backgroundColor: Constants.primaryHeaderColor,
    padding: Constants.baseMarginPadding,
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    paddingTop: getStatusBarHeight(true),
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    marginTop: getStatusBarHeight() + 20,
  },
  subtitleText: {
    color: 'white',
    fontSize: 16,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    width: '90%',
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: "700"
  },
  input: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .8,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    borderRadius: 50
  },
  button: {
    width: Dimensions.get('window').width * .5,
    backgroundColor: Constants.primaryHeaderColor,
    display: 'flex',
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    borderRadius: 50,
    color: Constants.tertiaryBgColor,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  }
});

