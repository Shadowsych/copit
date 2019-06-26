// react packages
import React from "react";

// styling packages
import {StyleSheet, Alert, AsyncStorage, Image, View} from "react-native";
import * as Animatable from 'react-native-animatable';

// socket.io packages
import config from "../../server.json";
import io from "socket.io-client";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 150,
    height: 150
  }
});

class Loading extends React.Component {

  // load the application
  async loadApp() {
    // initiate the socket connection
    var socket = io.connect(config.serverDomain + ":" + config.serverPort);

    socket.on("connect", (data) => {
      // attempt to load the account token
      try {
        this.loadAccount(socket);
      } catch(error) {
        // an error occurred, load the login page
        console.log(error);
        this.loadLoginPage(socket);
      }
    });

    // the socket connection caused an error
    socket.on("connect_error", (error) => {
      console.log(error);
      Alert.alert("Connection Error!", "The connection to the server could " +
        "not be established! Please reload the app.");
    });
  }

  // load the account using the provided token
  async loadAccount(socket) {
    let token = await AsyncStorage.getItem("token");
    if(token != null) {
      // a token is stored, load the account
      socket.emit("loadAccount", {
        message: {
          token: token
        },
        handle: "handleLoadAccount"
      });

      // listen for a response from the server
      socket.on("loadAccount", (data) => {
        if(data.success) {
          // loaded the account successfully
          this.loadHomePage(socket, data.message);
        } else {
          console.log(data.message);
          this.loadLoginPage(socket);
        }
      });
    } else {
      // a token is not stored, load the login page
      this.loadLoginPage(socket);
    }
  }

  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Animatable.Image
          style={styles.logo}
          animation="bounceIn"
          onAnimationEnd={() => this.loadApp()}
          source={require("../../assets/icon.png")} />
      </View>
    );
  }

  // load the home page
  loadHomePage(socket, account) {
    this.props.navigation.replace("Home", {
      socket: socket,
      id: account.id,
      token: account.token,
      name: account.name,
      email: account.email,
      points: account.points,
      profile_photo: account.profile_photo
    });
  }

  // load the login page
  loadLoginPage(socket) {
    this.props.navigation.replace("Login", {
      socket: socket
    });
  }
}
export default Loading;
