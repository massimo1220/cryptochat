import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Chat from '../Chat/Chat';
import Friends from '../Friends/Friends';
import Impostazioni from '../Impostazioni/Impostazioni';
import * as Constants from '../../Constants/Constants';

export default createBottomTabNavigator(
  {
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarIcon: () => <Icon name="comment-o" size={24} color={Constants.tertiaryBgColor} />,
      },
    },
    Amici: {
      screen: Friends,
      navigationOptions: {
        tabBarIcon: () => <Icon name="users" size={24} color={Constants.tertiaryBgColor} />,
      },
    },
    Impostazioni: {
      screen: Impostazioni,
      navigationOptions: {
        tabBarIcon: () => <Icon name="cog" size={24} color={Constants.tertiaryBgColor} />,
      },
    },
  },
  {
    tabBarOptions: {
      inactiveTintColor: Constants.tertiaryBgColor,
      activeTintColor: 'white',
      activeBackgroundColor: Constants.primaryHeaderColor,
      inactiveBackgroundColor: Constants.primaryHeaderColor,
      style: {
        borderTopColor: Constants.tertiaryBgColor,
        borderTopWidth: 1,
        position: 'relative',
        top: 0,
        height: Dimensions.get('window').height * 0.070,
        backgroundColor: Constants.primaryHeaderColor,
      },
    },
  },
);
