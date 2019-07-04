// react packages
import React from "react";

// styling packages
import * as Font from "expo-font";
import {StyleSheet, Alert, AsyncStorage, Image, View, SafeAreaView} from "react-native";
import * as Animatable from 'react-native-animatable';

// config packages
import serverConfig from "../../../../config/server.json";

// socket.io packages
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

  // called whenever the component is loaded
  componentDidMount() {
    // load custom fonts
    Font.loadAsync({
      "ubuntu-regular": require("../../../../assets/fonts/Ubuntu-R.ttf")
    });
  }

  // load the application
  async loadApp() {
    // initiate the socket connection
    var socket = io.connect(serverConfig.serverDomain + ":" + serverConfig.serverPort);

    socket.on("connect", (data) => {
      // attempt to load the account token
      try {
        this.loadAccount(socket);
      } catch(error) {
        // an error occurred, load the login page
        console.log(error);
        this.loadLoginPage(socket);
      }
      socket.off("connect");
    });

    // the socket connection caused an error
    socket.on("connect_error", (error) => {
      console.log(error);
      Alert.alert("Connection Error!", "The connection to the server could " +
        "not be established! Please reload the app.");
      socket.off("connect_error");
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
        socket.off("loadAccount");
      });
    } else {
      // a token is not stored, load the login page
      this.loadLoginPage(socket);
    }
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Animatable.Image
          style={styles.logo}
          animation="bounceIn"
          onAnimationEnd={() => this.loadApp()}
          source={require("../../../../assets/icon.png")} />
      </SafeAreaView>
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
