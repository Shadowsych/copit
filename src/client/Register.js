// react packages
import React from "react";
import {Header as NavHeader} from 'react-navigation';
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';

// styling packages
import {StyleSheet, Alert, Image, Text, TouchableOpacity,
  Dimensions, KeyboardAvoidingView, View} from "react-native";
import {Input, Icon, Header, Button, Avatar} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  navbar: {
    flex: 0.05,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderBottomWidth: 0
  },
  spacing: {
    flex: 0.05
  },
  avatar: {
    flex: 0.235,
    justifyContent: "center",
    alignItems: "center"
  },
  input_text_form: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center"
  },
  input_text_container: {
    flex: 0.25,
    width: Dimensions.get("window").width * 0.85
  },
  input_text: {
    color: "#909090",
    fontFamily: "ubuntu-regular"
  },
  register_btn_container: {
    flex: 0.05,
    width: "80%"
  },
  register_btn: {
    backgroundColor: "#75B1DE"
  },
  register_disclaimer_text: {
    color: "#C0C0C0",
    fontFamily: "ubuntu-regular"
  }
});

class Register extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      profile_photo_base64: undefined,
      failed_email_text: "",
      failed_password_text: ""
    }
  }

  // register an account
  async registerAccount() {
    let socket = this.props.navigation.state.params.socket;
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let profilePhotoBase64 = this.state.profile_photo_base64;

    if(this.isRegistrationValid(name, email, password)) {
      // emit a message to register the account
      this.setState({loading: true});
      socket.emit("registerAccount", {
        message: {
          name: name,
          email: email,
          password: password,
          profile_photo_base64: profilePhotoBase64
        },
        handle: "handleRegisterAccount"
      });

      // listen for the register account response from the server
      socket.on("registerAccount", (data) => {
        this.setState({loading: false});
        if(data.success) {
          // registered the account, load the home page
          this.props.navigation.state.params.loadHomePage(data.message);
        } else if(!data.success) {
          // an error occurred when registering the account
          Alert.alert("Registration Error!", data.message);
        }
      });
    }
  }

  // upload a picture for the profile
  async uploadPicture() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // open the camera, then await for the user to take a picture
    let picture = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.2,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if(!picture.cancelled) {
      // set the state to the picture
      let profilePhotoBase64 = `${picture.base64}`;
      this.setState({
        profile_photo_base64: profilePhotoBase64
      });
    }
  }

  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.loading} />
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
        </Header>
        <TouchableOpacity onPress={() => this.uploadPicture()}
          style={styles.avatar} activeOpacity={0.8}>
          {!this.state.profile_photo_base64 ? (
            <Avatar rounded size="xlarge" icon={{name: "camera", type: "entypo"}} />
          ) : (
            <Avatar rounded size="xlarge"
              source={
                source={uri: `data:image/png;base64, ${this.state.profile_photo_base64}`}
              } />
          )}
        </TouchableOpacity>
        <View style={styles.spacing} />
        <View style={styles.spacing} />
        <KeyboardAvoidingView keyboardVerticalOffset={NavHeader.HEIGHT}
          behavior="padding" style={styles.input_text_form}>
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Full Name*"
            onChangeText={(text) => this.setState({name: text})}
            rightIcon={
              <Icon name="person" type="material" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Email*"
            onChangeText={(text) => this.setState({email: text})}
            errorMessage={this.state.failed_email_text}
            rightIcon={
              <Icon name="email" type="material" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Password*"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            errorMessage={this.state.failed_password_text}
            rightIcon={
              <Icon name="lock" type="entypo" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Confirm Password*"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({confirm_password: text})}
            errorMessage={this.state.failed_password_text}
            rightIcon={
              <Icon name="lock" type="entypo" size={24} color="#ADD8E6"/>
            } />
        </KeyboardAvoidingView>
        <Button title="Register" buttonStyle={styles.register_btn}
          onPress={() => this.registerAccount()}
          containerStyle={styles.register_btn_container} />
        <View style={styles.spacing} />
        <View style={styles.spacing}>
          <Text style={styles.register_disclaimer_text}>
            By registering I agree to the terms of service.
          </Text>
        </View>
      </View>
    );
  }

  // return if the registration fields are valid
  isRegistrationValid(name, email, password) {
    // determine if any required fields are blank
    let confirmPassword = this.state.confirm_password;
    if(name == "" || email == "" || password == "" || confirmPassword == "") {
      Alert.alert("Missing Information!", "Please fill in all required fields.");
      return false;
    }
    let isValid = true;

    // determine if the email is valid
    if(!this.isEmailValid(email)) {
      this.setState({failed_email_text: "This email is invalid"});
      isValid = false;
    }

    // determine if the passwords equal each other
    if(password != confirmPassword) {
      this.setState({failed_password_text: "Passwords do not match"});
      isValid = false;
    }
    return isValid;
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
export default Register;
