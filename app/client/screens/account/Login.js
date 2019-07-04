// react packages
import React from "react";
import Constants from 'expo-constants'
import {NavigationActions, Header as NavHeader} from "react-navigation";

// styling packages
import {StyleSheet, AsyncStorage, Dimensions, Image, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Alert, Text, View} from "react-native";
import {Input, Icon, Button} from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';

// config packages
import guestConfig from "../../../../config/guest.json";

// security packages
import md5 from "md5";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header_spacing: {
    flex: 0.15
  },
  logo_container: {
    flex: 0.375
  },
  logo: {
    width: 150,
    height: 150
  },
  input_text_form: {
    flex: 0.225,
    justifyContent: "center",
    alignItems: "center"
  },
  input_text_container: {
    flex: 0.50,
    width: Dimensions.get("window").width * 0.80
  },
  input_text: {
    color: "#909090",
    fontFamily: "ubuntu-regular"
  },
  login_btn_container: {
    flex: 0.075,
    width: "75%"
  },
  login_btn: {
    backgroundColor: "#75B1DE"
  },
  text_btn_container: {
    flex: 0.075,
    justifyContent: "center",
    alignItems: "center"
  },
  register_btn_text: {
    color: "#C0C0C0",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  guest_btn_text: {
    color: "#C0C0C0",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  }
});

class Login extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: "",
      failed_email_text: "",
      failed_password_text: ""
    }
  }

  // handle the login of the user
  async loginAccount() {
    let socket = this.props.navigation.state.params.socket;
    let email = this.state.email;
    let password = this.state.password;

    // emit a message to receive the account information
    this.setState({loading: true});
    socket.emit("loginAccount", {
      message: {
        email: email,
        password: md5(password)
      },
      handle: "handleLoginAccount"
    });

    // listen for the account information from the server
    socket.on("loginAccount", (data) => {
      this.setState({loading: false});
      if(data.success) {
        // the account exists, load the home page with its data
        this.loadHomePage(data.message);
      } else if(!data.success) {
        // failed to login the account
        this.setState({
          failed_email_text: "Could not verify the email address",
          failed_password_text: "Could not verify the password"
        });
      }
      socket.off("loginAccount");
    });
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} />
        <View style={styles.header_spacing} />
        <View style={styles.logo_container}>
          <Animatable.Image
            style={styles.logo}
            animation="fadeInDown"
            source={require("../../../../assets/icon.png")} />
        </View>
        <KeyboardAvoidingView keyboardVerticalOffset={NavHeader.HEIGHT}
          behavior="padding" style={styles.input_text_form}>
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Email"
            onChangeText={(text) => this.setState({email: text})}
            errorMessage={this.state.failed_email_text}
            rightIcon={
              <Icon name="email" type="material" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            errorMessage={this.state.failed_password_text}
            rightIcon={
              <Icon name="lock" type="entypo" size={24} color="#ADD8E6"/>
            } />
        </KeyboardAvoidingView>
        <Button title="Login" buttonStyle={styles.login_btn}
          onPress={() => this.loginAccount()}
          containerStyle={styles.login_btn_container} />
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => this.loadRegisterPage()}
          style={styles.text_btn_container}>
          <Text style={styles.register_btn_text}>New to our app? Register Here.</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => this.loginGuest()}
          style={styles.text_btn_container}>
          <Text style={styles.guest_btn_text}>Login as Guest</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // login as a guest
  loginGuest() {
    this.loadHomePage({
      id: guestConfig.id,
      token: guestConfig.token,
      name: "Guest",
      points: 0
    });
  }

  // load the register page
  loadRegisterPage() {
    this.props.navigation.navigate("Register", {
      socket: this.props.navigation.state.params.socket,
      loadHomePage: this.loadHomePage.bind(this)
    });
  }

  // load the home page
  loadHomePage(account) {
    // store the account token in the storage
    if(account.id != guestConfig.id) {
      AsyncStorage.setItem("token", account.token);
    }

    // pop the navigation stack, then navigate to the Home screen
    this.props.navigation.reset([
      NavigationActions.navigate({
        routeName: "Home",
        params: {
          socket: this.props.navigation.state.params.socket,
          id: account.id,
          token: account.token,
          name: account.name,
          email: account.email,
          profile_photo: account.profile_photo
        }
      })], 0
    );
  }
}
export default Login;
