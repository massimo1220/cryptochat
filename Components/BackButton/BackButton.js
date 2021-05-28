import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const backIcon = require('../../assets/back-arrow-white.png');

const BackButton = ({ close }) => (
  <TouchableOpacity style={styles.container} onPress={close}>
    <Image style={styles.image} source={backIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '10%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default BackButton;
