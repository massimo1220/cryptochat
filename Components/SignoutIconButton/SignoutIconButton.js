import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/auth';

const logoutIcon = require('../../assets/logout.png');

const SignoutIconButton = () => (
  <TouchableOpacity style={styles.container} onPress={() => firebase.auth().signOut()}>
    <Image style={styles.img} source={logoutIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: Dimensions.get('window').height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default SignoutIconButton;
