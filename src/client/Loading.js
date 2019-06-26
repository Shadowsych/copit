// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, View} from "react-native";
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
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Animatable.Image
          style={styles.logo}
          animation="bounceIn"
          onAnimationEnd={() => this.loadLoginPage()}
          source={require("../../assets/icon.png")} />
      </View>
    );
  }

  // load the login page after waiting a few second(s)
  loadLoginPage() {
    const waitTime = 1000;
    let loadTimer = setTimeout(() => {
      // initiate the socket connection
      let socket = io.connect(config.serverDomain + ":" + config.serverPort);

      // load the login page
      this.props.navigation.replace("Login", {
        socket: socket
      });
    }, waitTime);
  }
}
export default Loading;
