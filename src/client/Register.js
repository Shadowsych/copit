// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, View} from "react-native";
import * as Animatable from 'react-native-animatable';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Loading extends React.Component {
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }

  // register an account
  async registerAccount(name, email, password) {
    let socket = this.props.navigation.state.params.socket;

    // emit a message to register the account
    socket.emit("registerAccount", {
      message: {
        name: name,
        email: email,
        password: password
      },
      handle: "handleRegisterAccount"
    });

    // listen for the register account response from the server
    socket.on("registerAccount", (data) => {
      if(data.success) {
        // registered the account, load the home page
        this.loadHomePage(data.message.id, data.message.token, name, email);
      } else if(!data.success) {
        // an error occurred when registering the account
        Alert.alert("Register Error!", data.message);
      }
    });
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Loading;
