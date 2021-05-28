import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Constants from '../../Constants/Constants';

const add = require('../../assets/add.png');

const NewMessageButton = ({ toggleNewConversation }) => (
  <TouchableOpacity style={styles.container} onPress={() => toggleNewConversation()}>
    {/* <Image source={add} style={styles.image} /> */}
    <Icon name="plus-circle" size={40} color={Constants.tertiaryBgColor} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 75,
    right: 15,
    backgroundColor: Constants.primaryHeaderColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    // shadowColor: '#ccc',
    // shadowOffset: {	width: 0,	height: 2},
    // shadowOpacity: 1,
    // shadowRadius: 2,
    // elevation: 1, 
  },
  // image: {
  //   width: 55,
  //   height: 55,
  // },
});

export default NewMessageButton;
