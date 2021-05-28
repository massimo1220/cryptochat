import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Constants from '../../Constants/Constants';

const NotificationBadge = ({ newMessageCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{newMessageCount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: Constants.primaryHeaderColor,
    borderWidth: 1,
    borderColor: Constants.tertiaryBgColor,
    width: 35,
    height: 35,
  },
  text: {
    color: Constants.tertiaryBgColor,
    fontFamily: 'exo-regular',
    fontSize: 18,
  },
});


export default NotificationBadge;
