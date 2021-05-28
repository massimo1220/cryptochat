import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Chat from './Screens/Chat/Chat';
import HomeNavigationContainer from './Screens/HomeNavigationContainer/HomeNavigationContainer';
import Login from './Screens/Login/Login';
import CreateAccount from './Screens/CreateAccount/CreateAccount';
import SignoutIconButton from './Components/SignoutIconButton/SignoutIconButton';
import ResetPassword from './Screens/ResetPassword/ResetPassword';
import HeaderLogo from './Components/HeaderLogo/HeaderLogo';
import { View, Text, Image, BlurView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import * as Constants from './Constants/Constants';
import * as Font from 'expo-font';

const MainNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerTitle: () => <HeaderLogo />,
      headerTitleAlign: () => 'center',
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      }
    }
  },
  Chat: {
    screen: HomeNavigationContainer, 
    navigationOptions: {
      headerRight: () => <SignoutIconButton />, 
      headerTitle: () => <HeaderLogo />,
      headerTitleAlign: () => 'center',
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    },
  },
  CreateAccount: { 
    screen: CreateAccount,
    navigationOptions: {
      headerTitle: () => <HeaderLogo />,
      headerTitleAlign: () => 'center',
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      headerTitle: () => <HeaderLogo />,
      headerTitleAlign: () => 'center',
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Constants.primaryHeaderColor,
      },
    }
  }
});

const App = createAppContainer(MainNavigator);

export default App;
