import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import * as firebase from "firebase";
import "firebase/auth";
import * as Constants from "../../Constants/Constants";
import * as Font from "expo-font";

export default class ResetPassword extends Component {
  state = {
    email: "",
    loading: false,
    loadingFonts: true,
    error: null,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      "exo-regular": require("../../assets/fonts/Exo2-Regular.otf"),
    });
    this.setState({ loadingFonts: false });
  };

  handleChange = (text) => {
    this.setState({ email: text });
  };

  resetPassword = async () => {
    try {
      this.setState({ loading: true });
      const { email } = this.state;
      const { navigate } = this.props.navigation;
      if (!email) {
        alert("Please enter an email address");
        return;
      }
      await firebase.auth().sendPasswordResetEmail(email);
      alert(`A link to reset your password was sent to ${email}`);
      this.setState({ loading: false, email: "" });
      navigate("Login");
    } catch (error) {
      this.setState({ email: "", error });
      if (error.code === "auth/user-not-found") {
        alert("Unable reset password, did you spell your email correctly?");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address");
      } else {
        alert("Something went wrong, please try again later");
      }
    }
  };

  cancelResetPassword = () => {
    const { navigate } = this.props.navigation;
    this.setState({ email: "" });
    navigate("Login");
  };

  render() {
    const { email, loadingFonts } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        {!loadingFonts && <Text style={styles.header}>Resetta Password</Text>}
        <TextInput
          value={email}
          onChangeText={this.handleChange}
          placeholder="Email"
          style={styles.input}
        />
        {!loadingFonts && (
          <TouchableOpacity style={styles.button} onPress={this.resetPassword}>
            <Text style={styles.buttonText}>Resetta Password</Text>
          </TouchableOpacity>
        )}

        {!loadingFonts && (
          <TouchableOpacity
            style={styles.button}
            onPress={this.cancelResetPassword}
          >
            <Text style={styles.buttonText}>Annulla</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.primaryBgColor,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Constants.midMarginPadding,
  },
  header: {
    color: "white",
    fontSize: 32,
    marginVertical: Constants.baseMarginPadding,
    fontFamily: "exo-regular",
  },
  input: {
    width: Dimensions.get("window").width * 0.9,
    maxWidth: 400,
    height: 50,
    borderRadius: 50,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "white",
    marginVertical: Constants.baseMarginPadding,
  },
  button: {
    width: Dimensions.get("window").width * 0.9,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: Constants.baseMarginPadding,
    borderColor: Constants.tertiaryBgColor,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
    fontFamily: "exo-regular",
  },
});
