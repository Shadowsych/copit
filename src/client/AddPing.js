// react packages
import React from "react";
import {Header as NavHeader} from 'react-navigation';
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';

// styling packages
import {StyleSheet, Dimensions, Image, KeyboardAvoidingView, SafeAreaView,
  Text, Alert, TouchableOpacity, View} from "react-native";
import {Header, Input, CheckBox, Icon} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navbar: {
    flex: 0.05,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderBottomWidth: 0
  },
  title_text: {
    color: "#D3D3D3",
    fontSize: 24,
    fontFamily: "ubuntu-regular"
  },
  spacing: {
    flex: 0.05
  },
  upload_picture_btn: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "center"
  },
  upload_picture_text: {
    color: "#D3D3D3",
    fontSize: 12,
    fontFamily: "ubuntu-regular"
  },
  picture: {
    width: Dimensions.get("window").width * 0.90,
    height: "100%"
  },
  input_text_form: {
    flex: 0.525,
    justifyContent: "center",
    alignItems: "center"
  },
  input_text_container: {
    flex: 0.25,
    width: Dimensions.get("window").width * 0.90
  },
  input_text: {
    color: "#909090",
    fontFamily: "ubuntu-regular"
  },
  anonymous_checkbox_container: {
    flex: 0.25
  },
  anonymous_checkbox_text: {
    color: "#909090"
  },
  notice_text: {
    color: "#909090",
    fontSize: 12,
    fontFamily: "ubuntu-regular"
  },
  add_ping_btn: {
    flex: 0.075,
    width: "100%",
    backgroundColor: "#75B1DE",
    alignItems: "center",
    justifyContent: "center"
  },
  add_ping_text: {
    color: "white",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  }
});

class AddPing extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      title: "",
      description: "",
      picture_base64: undefined,
      anonymous: false
    }
  }

  // add ping
  async addPing() {
    let socket = this.props.navigation.state.params.socket;

    if(this.state.title == "" || this.state.description == "") {
      Alert.alert("Missing Information!", "Please fill out both the title and description.");
    } else {
      // add the marker into the server
      this.setState({loading: true});
      this.sendMarker();
    }
  }

  // send the marker information
  async sendMarker() {
    let socket = this.props.navigation.state.params.socket;

    // receive location permissions
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((position) => {
        // set the location
        this.setState({
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }}
        );
        // add the marker into the server
        this.addMarker(position);
        return;
      }).catch((error) => {
        this.setState({loading: false});
        Alert.alert("GPS Error!", "Please make sure your location (GPS) is turned on.");
      });
    }
  }

  // add the marker into the server
  async addMarker(position) {
    let socket = this.props.navigation.state.params.socket;

    // determine whether the author is anonymous
    let author = this.props.navigation.state.params.name
    if(this.state.anonymous) {
      author = "Anonymous";
    }

    // emit a message to add the marker
    socket.emit("addMarker", {
      message: {
        author_id: this.props.navigation.state.params.id,
        author_token: this.props.navigation.state.params.token,
        author: author,
        title: this.state.title,
        description: this.state.description,
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        picture_base64: this.state.picture_base64,
        category: this.props.navigation.state.params.category
      },
      handle: "handleAddMarker"
    });

    // listen for a response from the server
    socket.on("addMarker", (data) => {
      if(data.success) {
        // navigate back to the home screen
        this.setState({loading: false});
        Alert.alert("Added Ping!", data.message);

        // navigate back to the home screen, then update location
        this.props.navigation.popToTop();
        this.props.navigation.state.params.updateLocation();
      } else {
        this.setState({loading: false});
        Alert.alert("Database Error!", data.message);
      }
    });
  }

  // upload a picture for the ping
  async uploadPicture() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // open the camera, then await for the user to take a picture
    let picture = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.2,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if(!picture.cancelled) {
      // set the state to the picture
      let pictureBase64 = `${picture.base64}`;
      this.setState({
        picture_base64: pictureBase64
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
          <Text style={styles.title_text}>
            {this.props.navigation.state.params.category}
          </Text>
        </Header>
        <View style={styles.spacing} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.uploadPicture()}
          style={styles.upload_picture_btn}>
          {!this.state.picture_base64 ? (
            <View>
              <Icon name="camera" type="antdesign" color="#D3D3D3" size={56} />
              <Text style={styles.upload_picture_text}>Tap to Open Camera</Text>
            </View>
          ) : (
            <Image
              style={styles.picture}
              source={{uri: `data:image/png;base64, ${this.state.picture_base64}`}}
            />
          )}
        </TouchableOpacity>
        <KeyboardAvoidingView keyboardVerticalOffset={NavHeader.HEIGHT - 84}
          behavior="padding" style={styles.input_text_form}>
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            maxLength={24}
            selectionColor="#909090"
            placeholder="Input title here...*"
            onChangeText={(text) => this.setState({title: text})}
            rightIcon={
              <Icon name="title" type="material" color="#D3D3D3" size={28} />
            }
          />
          <Input
            containerStyle={styles.input_text_container}
            inputStyle={styles.input_text}
            maxLength={128}
            selectionColor="#909090"
            placeholder="Input short description here...*"
            onChangeText={(text) => this.setState({description: text})}
            rightIcon={
              <Icon name="form" type="antdesign" color="#D3D3D3" size={28} />
            }
          />
          <View style={styles.anonymous_checkbox_container}>
            <CheckBox
              textStyle={styles.anonymous_checkbox_text}
              title="Post This Ping Anonymously"
              fontFamily="ubuntu-regular"
              checked={this.state.anonymous}
              onPress={() => this.setState({anonymous: !this.state.anonymous})}
            />
          </View>
          <Text style={styles.notice_text}>Notice: This will ping your current location.</Text>
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => this.addPing()}
          activeOpacity={0.8}
          style={styles.add_ping_btn}>
          <Text style={styles.add_ping_text}>Add Ping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default AddPing;
