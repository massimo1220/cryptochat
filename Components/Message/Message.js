import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Constants from '../../Constants/Constants';

export default class Message extends Component {

  state = {
    showDeleteMessage: false,
  }

  formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    let hours = Number(date.getHours());
    const label = (hours >= 12) ? 'PM': 'AM';
    let minutes = Number(date.getMinutes());
    if(hours > 12) {
      hours = hours - 12;
    } else if(hours === 0) {
      hours = 12;
    }
    if(minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes} ${label}`;
  }

  handleDeleteMessage = async () => {
    const { content, isSender, deleteMessage } = this.props;
    await deleteMessage(content, isSender);
    this.setState({ showDeleteMessage: false });
  }

  renderMessage = () => {
    const { content, timestamp, isSender, deleteMessage } = this.props;
    const { showDeleteMessage } = this.state;
    const time = this.formatTimestamp(timestamp);
    if(!showDeleteMessage) {
      return (
          <TouchableOpacity activeOpacity={0.75} style={isSender ? styles.senderContainer: styles.container} onLongPress={this.toggleShowDeleteMessage}>
            <Text style={isSender ? styles.senderContent: styles.content}>{content}</Text>
            <Text style={isSender ? styles.senderTimestamp: styles.timestamp}>{time}</Text>
          </TouchableOpacity>
      );
    } else {
      return (
        <View style={isSender ? styles.senderContainer: styles.container}>
          
          <View style={styles.deleteContainer}>
            <TouchableOpacity
              onPress={this.handleDeleteMessage}
              style={styles.deleteBtn}
            > 
            <View style={styles.deleteContainer2}>
              <Text style={isSender ? styles.senderContent: styles.content}>Elimina</Text>
              <Icon name="trash" size={14} color={'white'}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={this.toggleShowDeleteMessage}
              style={styles.deleteBtn}
            >
               <View style={styles.deleteContainer2}>
               <Text style={isSender ? styles.senderContent: styles.content}>Annulla</Text>
               <Icon name="undo" size={14} color={'white'}/>
               </View>
            </TouchableOpacity>
          </View>
        </View>  
      );
    }
  }
    
  toggleShowDeleteMessage = () => {
    const { showDeleteMessage } = this.state;
    this.setState({ showDeleteMessage: !showDeleteMessage });
  }

  render() {
    return this.renderMessage();
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: '#5CCC9A',
    borderRadius: 13,
    marginTop: 15,
    width: Dimensions.get('window').width * .9,
    paddingBottom: 5,
    borderWidth: 1,
    marginLeft: 10,
    paddingLeft: 15
  },
  deleteContainer: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteContainer2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  deleteBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    width: 100,
    marginTop: 5,
    marginLeft: 0,
    borderRadius: 50,
    backgroundColor: '#3FBA80',
    // shadowColor: '#232323',
    // shadowOffset: {	width: 0,	height: 0},
    // shadowOpacity: 0.4,
    // shadowRadius: 2,
    // elevation: 1, 
  },  
  content: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    fontFamily: 'exo-regular',
    textAlign: 'center',
  },
  timestamp: {
    alignSelf: 'flex-start',
    marginLeft: 6,
    color: 'white',
    fontSize: 12,
    fontFamily: 'exo-regular',
  },
  senderContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 15,
    width: Dimensions.get('window').width * .9,
    paddingBottom: 5,
    paddingRight: 10,
    borderColor: '#abababeb',
    borderWidth: 0,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  senderContent: {
    padding: 5,
    fontSize: 18,
    color: 'black',
    fontFamily: 'exo-regular',
    textAlign: 'center',
  },
  senderTimestamp: {
    alignSelf: 'flex-end',
    marginRight: 5.5,
    color: 'black',
    fontSize: 12,
    fontFamily: 'exo-regular',
  },
});

