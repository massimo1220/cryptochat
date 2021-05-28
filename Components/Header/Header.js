import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Cryptochat</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.1,
    backgroundColor: 'white',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    color: 'white',
  },
});
