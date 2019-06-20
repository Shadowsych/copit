// react packages
import React from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// styling packages
import {StyleSheet, Image, TouchableOpacity, Text, View} from "react-native";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Header, Icon} from "react-native-elements";
import * as Animatable from 'react-native-animatable';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  navbar: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderBottomWidth: 0,
    width: "100%",
    height: 50,
    top: 0,
    left: 0
  },
  map: {
    flex: 1,
    zIndex: -1,
    width: "100%",
    height: "100%"
  },
  reorientation_btn: {
    position: 'absolute',
    bottom: 40,
    left: 15
  },
  swipe_up_container: {
    position: 'absolute',
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: "100%",
    height: 75,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  swipe_up_text: {
    color: "#75B1DE",
    fontWeight: "bold",
    fontSize: 12
  }
});

class Home extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      location: {
        longitude: -97.73675,
        latitude: 30.28265
      }
    }
  }

  // called whenever the component loads
  componentDidMount() {
    this.updateLocation();
  }

  // update the location of the user
  async updateLocation() {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((position) => {
        // set the location
        this.setState({
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }
        });
        return;
      }).catch((error) => {
        alert(error + ": " + "Please make sure your location (GPS) is turned on.");
      });
    }
  }

  // render the component's views
  render() {
    // gesture configuration
    const gestureConfig = {
      velocityThreshold: 0.10,
      directionalOffsetThreshold: 80
    };

    return (
      <View style={styles.container}>
        <Header containerStyle={styles.navbar} placement="left">
          <Icon raised name="menu" color="#1C7ED7" size={22} />
          <Icon raised name="search" color="#1C7ED7" size={22} />
        </Header>
        <MapView
          style={styles.map}
          region={{
            longitude: this.state.location.longitude,
            longitudeDelta: 0.015,
            latitude: this.state.location.latitude,
            latitudeDelta: 0.015,
          }}
        />
        <GestureRecognizer
          onSwipeUp={() => this.loadPingsPage()}
          config={gestureConfig}
          style={styles.swipe_up_container}>
            <Animatable.View animation="pulse" iterationCount="infinite">
              <Text style={styles.swipe_up_text}>Swipe up!</Text>
              <Icon name="arrow-up" type="feather" color="#1C7ED7" />
            </Animatable.View>
        </GestureRecognizer>
        <TouchableOpacity activeOpacity={0.8} style={styles.reorientation_btn}>
          <Icon raised name="target" onPress={() => this.updateLocation()}
            type="material-community" color="#1C7ED7" />
        </TouchableOpacity>
      </View>
    );
  }

  // load the pings page
  loadPingsPage() {
    this.props.navigation.navigate("Pings");
  }
}
export default Home;
