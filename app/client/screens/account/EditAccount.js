// react packages
import React from "react";
import {Header as NavHeader, NavigationActions} from 'react-navigation';
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';

// styling packages
import {StyleSheet, Alert, Image, Text, TouchableOpacity,
  SafeAreaView, Dimensions, KeyboardAvoidingView, View} from "react-native";
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
  update_btn_container: {
    flex: 0.05,
    width: "80%"
  },
  update_btn: {
    backgroundColor: "#75B1DE"
  },
  update_disclaimer_text: {
    color: "#C0C0C0",
    fontFamily: "ubuntu-regular"
  }
});

class EditAccount extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      password: "",
      confirm_password: "",
      profile_photo_base64: undefined,
      failed_email_text: "",
      failed_password_text: ""
    }
  }

  // update the account
  async editAccount() {
    let socket = this.props.navigation.state.params.socket;
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let profilePhotoBase64 = this.state.profile_photo_base64;

    if(this.isEditValid(name, email, password)) {
      // emit a message to edit the account
      this.setState({loading: true});
      socket.emit("editAccount", {
        message: {
          token: this.props.navigation.state.params.token,
          name: name,
          email: email,
          password: password,
          profile_photo_base64: profilePhotoBase64
        },
        handle: "handleEditAccount"
      });

      // listen for the edit account response from the server
      socket.on("editAccount", (data) => {
        this.setState({loading: false});
        if(data.success) {
          // edited the account, then reload the home page
          Alert.alert("Edited Account!", data.message);
          this.reloadHomePage();
        } else if(!data.success) {
          // an error occurred when editing the account
          Alert.alert("Editing Error!", data.message);
        }
        socket.off("editAccount");
      });
    }
  }

  // upload a picture for the profile
  async uploadPicture() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // await for the user to pick a picture from the library
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
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} />
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
        </Header>
        <TouchableOpacity onPress={() => this.uploadPicture()}
          style={styles.avatar} activeOpacity={0.8}>
          {!this.state.profile_photo_base64 ? (
            <Avatar rounded icon={{name: "camera-off", type: "feather"}} size="xlarge"
              source={{uri: this.props.navigation.state.params.profile_photo}} />
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
            placeholder="New Profile Name*"
            value={this.state.name}
            onChangeText={(text) => this.setState({name: text})}
            rightIcon={
              <Icon name="person" type="material" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="New Email*"
            value={this.state.email}
            onChangeText={(text) => this.setState({email: text})}
            errorMessage={this.state.failed_email_text}
            rightIcon={
              <Icon name="email" type="material" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="New Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            errorMessage={this.state.failed_password_text}
            rightIcon={
              <Icon name="lock" type="entypo" size={24} color="#ADD8E6"/>
            } />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            placeholder="Confirm New Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({confirm_password: text})}
            errorMessage={this.state.failed_password_text}
            rightIcon={
              <Icon name="lock" type="entypo" size={24} color="#ADD8E6"/>
            } />
        </KeyboardAvoidingView>
        <Button title="Update Account" buttonStyle={styles.update_btn}
          onPress={() => this.editAccount()}
          containerStyle={styles.update_btn_container} />
        <View style={styles.spacing} />
        <View style={styles.spacing}>
          <Text style={styles.update_disclaimer_text}>
            By updating I agree to the terms of service.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // return if the edit fields are valid
  isEditValid(name, email, password) {
    // determine if any required fields are blank
    let confirmPassword = this.state.confirm_password;
    if(name == "" || email == "") {
      Alert.alert("Missing Information!", "Please fill in all required fields.");
      return false;
    }
    let isValid = true;

    // determine if the email is valid
    if(!this.isEmailValid(email)) {
      this.setState({failed_email_text: "This email is invalid"});
      isValid = false;
    }

    // if updating password, determine if the passwords equal each other
    if(password != "" && (password != confirmPassword)) {
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

  // reload the home page
  reloadHomePage() {
    let socket = this.props.navigation.state.params.socket

    // load the account
    this.setState({loading: true});
    socket.emit("loadAccount", {
      message: {
        token: this.props.navigation.state.params.token
      },
      handle: "handleLoadAccount"
    });

    // listen for a response from the server
    socket.on("loadAccount", (data) => {
      this.setState({loading: false});
      if(data.success) {
        // loaded the account successfully, navigate to the home page
        this.props.navigation.reset([
          NavigationActions.navigate({
            routeName: "Home",
            params: {
              socket: socket,
              id: this.props.navigation.state.params.id,
              token: this.props.navigation.state.params.token,
              name: data.message.name,
              email: data.message.email,
              profile_photo: data.message.profile_photo
            }
          })], 0
        );
      }
      socket.off("loadAccount");
    });
  }
}
export default EditAccount;
