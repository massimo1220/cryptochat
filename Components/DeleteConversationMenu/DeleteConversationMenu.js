import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Constants from '../../Constants/Constants';

const DeleteConversationMenu = ({ deleteConversation, toggleDeleteConversationMenu }) => (
  <View style={styles.deleteConversationContainer}>
    <Text style={styles.header}>Cancella conversazione?</Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.confirmButton} onPress={deleteConversation}>
        <Text style={styles.textConfirm}>
          Si
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={toggleDeleteConversationMenu}>
        <Text style={styles.textCancel}>
          No
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  deleteConversationContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Constants.primaryHeaderColor,
    top: '50%',
    left: '50%',
    width: 300,
    height: 150,
    marginTop: -150,
    marginLeft: -150,
    borderRadius: 6,
    zIndex: 5,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  buttonContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  header: {
    color: Constants.tertiaryBgColor,
    fontSize: 20,
  },
  textConfirm: {
    fontSize: 16,
    color: Constants.primaryHeaderColor,
    fontWeight: 'bold',
  },
  textCancel: {
    fontSize: 20,
    color: Constants.tertiaryBgColor,
    fontWeight: 'bold',
  },
  confirmButton: {
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 50,
    backgroundColor: Constants.tertiaryBgColor,
  },
  cancelButton: {
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 50,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
});

export default DeleteConversationMenu;
