import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
 } from 'expo-ads-admob';

 export default class BannerAd extends Component {

  render() {
   return (
   <View>
    <AdMobBanner style={styles.bannerAd}
    bannerSize="fullBanner"
    adUnitID="ca-app-pub-6134453091807474/4613694860"
    onDidFailToReceiveAdWithError={this.bannerError}
    onAdViewDidReceiveAd = {this.bannerAdReceived} />
   </View>
   );
   }
  }

  const styles = StyleSheet.create({
    bannerAd: {
      width: "100%",
      top: 0
    },
    interstitialBanner: {
      width: "100%",
      marginLeft: 0,
      color: '#00FFFF'
    }
  });