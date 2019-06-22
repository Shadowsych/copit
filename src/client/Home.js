// react packages
import React from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// styling packages
import {StyleSheet, Image, TouchableOpacity, Text, Alert, View} from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import {Icon} from "react-native-elements";
import * as Animatable from 'react-native-animatable';

// socket.io packages
import io from "socket.io-client";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  menu_btn: {
    position: "absolute",
    top: 10,
    left: 10
  },
  search_btn: {
    position: "absolute",
    top: 10,
    left: 85
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
      socket: undefined,
      location: {
        longitude: -97.73675,
        latitude: 30.28265
      },
      locationDelta: {
        longitudeDelta: 0.005,
        latitudeDelta: 0.005
      },
      markers: []
    }
  }

  // called before the component loads
  componentWillMount() {
    this.initiateSocketConnection();
  }

  // initiate the socket.io connection
  async initiateSocketConnection() {
    const serverDomain = "http://192.168.0.18";
    const serverPort = "3000";
    this.setState({socket: await io.connect(serverDomain + ":" + serverPort)});
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
          },
          locationDelta: {
            longitudeDelta: 0.005,
            latitudeDelta: 0.005
          }
        });
        // receive the markers from the server
        this.receiveMarkers(position);
        return;
      }).catch((error) => {
        Alert.alert("GPS Error!", "Please make sure your location (GPS) is turned on.");
      });
    }
  }

  // receive the markers to place on the map
  async receiveMarkers(position) {
    // emit a message to receive the markers
    this.state.socket.emit("receiveMarkers", {
      message: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      },
      handle: "handleReceiveMarkers"
    });
    // listen for the markers from the server
    this.state.socket.on("receiveMarkers", (data) => {
      if(data.success) {
        this.setState({
          markers: JSON.parse(data.message)
        });
      } else {
        Alert.alert("Database Error!", data.message);
      }
    })
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
        <Icon containerStyle={styles.menu_btn} raised name="menu"
          onPress={() => this.loadMenuPage()} color="#1C7ED7" size={22} />
        <Icon containerStyle={styles.search_btn} raised name="search"
          onPress={() => this.loadSearchPage()} color="#1C7ED7" size={22} />
        <MapView
          style={styles.map}
          region={{
            longitude: this.state.location.longitude,
            longitudeDelta: this.state.locationDelta.longitudeDelta,
            latitude: this.state.location.latitude,
            latitudeDelta: this.state.locationDelta.latitudeDelta,
          }}>
            <MapView.Marker
              coordinate={{
                longitude: this.state.location.longitude,
                latitude: this.state.location.latitude
              }}
              title="You Are Here"/>
            {this.state.markers.map((marker, key) => (
              <MapView.Marker
                key={key}
                coordinate={{
                  longitude: marker.longitude,
                  latitude: marker.latitude
                }}
              />
            ))}
        </MapView>
        <GestureRecognizer
          onSwipeUp={() => this.loadPingsPage()}
          config={gestureConfig}
          style={styles.swipe_up_container}>
            <Animatable.View animation="pulse" iterationCount="infinite">
              <Text style={styles.swipe_up_text}>Swipe to add ping!</Text>
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

  // load the menu page
  loadMenuPage() {
    this.props.navigation.navigate("Menu");
  }

  // load the search page
  loadSearchPage() {
    this.props.navigation.navigate("Search");
  }

  // load the pings page
  loadPingsPage() {
    this.props.navigation.navigate("Pings", {
      socket: this.state.socket,
      id: this.props.navigation.state.params.id,
      name: this.props.navigation.state.params.name
    });
  }
}
export default Home;
