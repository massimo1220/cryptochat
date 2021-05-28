import React, { Component } from 'react';
import { 
  Text,  
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase';
import * as Constants from '../../Constants/Constants';
import * as Font from 'expo-font';
import 'firebase/auth';
import ApiKeys from '../../ApiKeys';
// const logo = require('../../assets/logo.png');
// OnBoarding
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoarding from '../../Components/OnBoarding/OnBoarding';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.is_mounted = false;
  }
  state = {
    email: '',
    password: '',
    loading: false,
    loadingFonts: true,
    error: null,
    firstLaunched: 'false', //OnBoarding
  }

  componentDidMount = async () => {
    this.is_mounted = true;
    if(this.is_mounted) {
      await Font.loadAsync({
        'exo-regular': require('../../assets/fonts/Exo2-Regular.otf'),
      });
      this.setState({ loadingFonts: false });

      // OnBoarding 
      this.setState({ loading: true });
      await AsyncStorage.getItem('firstLaunchKey').then(response => {
        if (response) {
          this.setState({ firstLaunched: response });
        }
      });
      this.setState({ loading: false }); // End OnBoarding
  
      if(!firebase.apps.length) {
        await firebase.initializeApp(ApiKeys.FirebaseConfig);
      } 
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          this.props.navigation.replace('Chat');
        }
      });
    }
  }

  async writeDataToLocal() {
    this.setState({ loading: true, firstLaunched: 'true' });
    await AsyncStorage.setItem('firstLaunchKey', 'true');
    this.setState({ loading: false });
  }

  componentWillUnmount = () => {
    this.is_mounted = false;
  }

  handleEmailChange = (email) => {
    this.setState({ email });
  }

  handlePasswordChange = (password) => {
    this.setState({ password });
  }

  handleLogin = async () => {
    await this.setState({ loading: true });
    const { email, password } = this.state;
    if(this.handleInputCheck(email, password)) {
      await firebase.auth().signInWithEmailAndPassword(email.toLowerCase(), password)
        .then(() => this.setState({ loading: false }))
        .catch((error) => {
          this.setState({ error, loading: false });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  handleInputCheck = (email, password) => {
    if(!email && !password) {
      alert('Please enter email and password');
    } else if(!email) {
      this.setState({ password: '' })
      alert('Please enter your email');
    } else if(!password) {
      alert('Please enter you password');
    }
    if(!email || !password) {
      return false;
    }
    return true;
  }

  returnErrorMessage = (code) => {
    switch(code) {
      case 'auth/wrong-password':
        this.setState({ password: '' });
        alert('Incorrect Username or Password');
        break;
      case 'auth/user-not-found':
        alert('Incorrect Username or Password');
        break;
      case 'auth/invalid-email':
        alert('Please enter an email address');
        break;
      default:
        alert(code, 'hi');
        break;
    }
  }

  handleNavigation = (screen) => {
    const { navigate } = this.props.navigation;
    this.setState({ email: '', password: '' });
    navigate(screen);
  }

  errorTimeout = () => {
    setTimeout(() => {
      this.setState({ error: null });
    }, 6000);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loading, loadingFonts, error } = this.state;
    if(error) {
      this.errorTimeout();
    }
    // AsyncStorage.clear();
    // OnBoarding
    if (this.state.firstLaunched == 'true' && !this.state.loading) {
      return (
          <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.inner}>
        {/* <Image source={logo} style={styles.logo}/> */}
          {!loadingFonts && <Text style={styles.header}>Login</Text>}          
          <View style={styles.loginContainer}>
            { (error && !loadingFonts) && <Text style={styles.error}>Something went wrong...</Text> }
            <TextInput
              style={styles.input}
              value={this.state.email}
              onChangeText={this.handleEmailChange}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
              placeholder="Password"
            />
          </View>
          {!loadingFonts && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => this.handleNavigation('CreateAccount')}><Text style={styles.buttonText}>Registrati</Text></TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => this.handleNavigation('ResetPassword')}><Text style={styles.buttonText}>Resetta Password</Text></TouchableOpacity>
            </View>
          )}
          <ActivityIndicator 
            animating={loading} 
            size="large" 
            color={Constants.tertiaryBgColor}
            style={{ position: 'absolute', top: '35%', left: '50%', zIndex: 5 }}
          />
        </View>
      </KeyboardAvoidingView>
      )
    } else if (this.state.loading) {
      return <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#8e8f91' }}>
      <Text style={{ color: '#fff' }}>Application starting...</Text>
    </View>
    } else {
      return <OnBoarding onLoadFunc={() => this.writeDataToLocal()} />
    }
    

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.primaryBgColor,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#151515',
    width: 100, 
    height: 100,
    marginVertical: Constants.baseMarginPadding,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  loginContainer: {
    marginVertical: Constants.baseMarginPadding,
  },
  input: {
    width: Dimensions.get('window').width * .9,
    maxWidth: 400,
    height: 50,
    borderRadius: 50,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'white',
    marginVertical: Constants.baseMarginPadding,
    shadowColor: 'black',
    shadowOffset: {	width: 0,	height: 5},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1, 
  },
  header: {
    color: 'white',
    fontSize: 32,
    marginTop: 5,
    fontFamily: 'exo-regular',
    textAlign: 'center',
  },
  button: { 
    height: 50, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: Constants.baseMarginPadding,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },  
    shadowColor: 'black',  
    shadowOpacity: 0.4,  
    elevation: 3,  
    zIndex:999, 
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'exo-regular',
  },
  error: {
    color: 'red',
    fontFamily: 'exo-regular',
    fontSize: 16,
    textAlign: 'center',
  },
});