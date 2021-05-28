import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import * as Constants from '../../Constants/Constants';

const ConversationTab = ({
  from,
  time,
  updateSelectedConversation,
  handleConversationTabLongPress,
  newMessageCount,
}) => (
  <TouchableOpacity style={styles.container} onPress={() => updateSelectedConversation(from)} onLongPress={() => handleConversationTabLongPress(from)}>
    <Text style={styles.text}>{from}</Text>
    { newMessageCount === 0 && <Text style={styles.text}>{time}</Text> }
    { newMessageCount > 0 && <NotificationBadge newMessageCount={newMessageCount} /> }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.125,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: Constants.tertiaryBgColor,
    borderBottomWidth: 1,
    paddingHorizontal: Constants.midMarginPadding,
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'exo-regular',
  },
});

export default ConversationTab;
