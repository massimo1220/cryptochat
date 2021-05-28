import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Constants from '../../Constants/Constants';

const ConfirmDeleteAccount = ({ handleDeleteAccount, cancelDelete }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Elimina Account</Text>
    <Text style={styles.text}>Sei sicuro di voler eliminare il tuo account?</Text>
    <Text style={styles.text}>I tuoi messaggi e il tuo account verranno eliminati definitivamente!</Text>
    <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
      <Text style={styles.buttonText}>Si</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={cancelDelete}>
      <Text style={styles.buttonText}>No</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Constants.primaryBgColor,
    paddingTop: 40,
  },
  header: {
    color: 'white',
    fontSize: 40,
    marginVertical: Constants.baseMarginPadding,
    fontFamily: 'exo-regular',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
    fontFamily: 'exo-regular',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 20,
  },
  button: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: Constants.primaryHeaderColor,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: Constants.baseMarginPadding,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    color: Constants.tertiaryBgColor,
    fontFamily: 'exo-regular',
  },
});

export default ConfirmDeleteAccount;
