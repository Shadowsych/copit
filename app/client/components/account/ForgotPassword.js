// react packages
import React from "react";
import {NavigationActions, Header as NavHeader} from "react-navigation";

// styling packages
import {StyleSheet, AsyncStorage, Image, TouchableOpacity,
  SafeAreaView, Dimensions, Text, View} from "react-native";
import {Input, Icon, Button} from "react-native-elements";

// config packages
import guestConfig from "../../../../config/accounts/guest.json";

// security packages
import md5 from "md5";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input_container: {
    flex: 0.20
  },
  input_text_container: {
    width: "100%"
  },
  input_text: {
    color: "#909090",
    fontFamily: "ubuntu-regular"
  },
  btn_container: {
    flex: 0.20,
    width: "100%"
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#75B1DE"
  },
  disabled_btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B2B2B2"
  },
  disabled_btn_text: {
    color: "white"
  },
  message_text_container: {
    flex: 0.10,
    alignItems: "center"
  },
  message_text: {
    color: "#909090",
    fontSize: 12,
    fontFamily: "ubuntu-regular",
  }
});

class ForgotPassword extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      serial: "",
      sent_email: false,
      email_message_text: "An email will be sent with your serial key.",
      serial_message_text: "Enter your serial key from the sent email."
    }
  }

  // send the forgot password email
  async emailForgotPassword() {
    let socket = this.props.socket;

    if(this.isEmailValid(this.state.email)) {
      // emit an email forgot password to the server
      socket.emit("emailForgotPassword", {
        message: {
          email: this.state.email
        },
        handle: "handleEmailForgotPassword"
      });

      // received a response from the server
      socket.on("emailForgotPassword", (data) => {
        if(data.success) {
          this.setState({sent_email: true});
        }
        this.setState({email_message_text: data.message});
        socket.off("emailForgotPassword");
      });
    } else {
      this.setState({email_message_text: "Please enter a valid email address!"});
    }
  }

  // use the serial key
  async useSerialKey() {
    let socket = this.props.socket;

    if(this.isEmailValid(this.state.email) && this.state.serial) {
      // emit a use serial key to the server
      socket.emit("useSerialKey", {
        message: {
          email: this.state.email,
          serial: this.state.serial
        },
        handle: "handleUseSerialKey"
      });

      // received a response from the server
      socket.on("useSerialKey", (data) => {
        if(data.success) {
          // the serial key was valid, login the user using the account data
          this.props.loadHomePage(data.message);
        } else {
          this.setState({serial_message_text: data.message});
        }
        socket.off("useSerialKey");
      });
    } else {
      this.setState({
        serial_message_text: "Please enter a valid email address and serial key!"
      });
    }
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.input_container}>
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Email"
            maxLength={256}
            onChangeText={(text) => this.setState({email: text})}
            rightIcon={
              <Icon name="email" type="material" size={24} color="#ADD8E6"/>
            } />
        </View>
        <Button title="Email Serial Key" buttonStyle={styles.btn}
          onPress={() => this.emailForgotPassword()}
          disabled={this.state.sent_email}
          disabledStyle={styles.disabled_btn}
          disabledTitleStyle={styles.disabled_btn_text}
          containerStyle={styles.btn_container} />
        <View style={styles.message_text_container}>
          <Text style={styles.message_text}>{this.state.email_message_text}</Text>
        </View>
        <View style={styles.input_container}>
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Serial Key"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({serial: text})}
            rightIcon={
              <Icon name="key" type="entypo" size={24} color="#ADD8E6"/>
            } />
        </View>
        <Button title="Use Serial Key" buttonStyle={styles.btn}
          onPress={() => this.useSerialKey()}
          containerStyle={styles.btn_container} />
        <View style={styles.message_text_container}>
          <Text style={styles.message_text}>{this.state.serial_message_text}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // return if an email is valid
  isEmailValid(email) {
    let emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default ForgotPassword;
