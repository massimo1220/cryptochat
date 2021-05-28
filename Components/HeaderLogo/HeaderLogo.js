import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';
import * as Constants from '../../Constants/Constants';
const logo = require('../../assets/logo_header.png');

export default class renderLogo extends Component {
  state = {
    loadingFont: true,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
    });
    this.setState({ loadingFont: false });
  }

  render() {
    const { loadingFont } = this.state;
    const { loading, loaded } = styles;
    return (
      <Text style={loadingFont ? loading : loaded}>Cryptochat</Text>
      // <Image source={logo}/>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    color: Constants.tertiaryBgColor, 
    fontSize: 24,
  },
  loaded: {
    fontFamily: 'exo-regular', 
    color: 'white', 
    fontSize: 24,
  }
})
