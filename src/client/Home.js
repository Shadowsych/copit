// react packages
import React from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// styling packages
import {StyleSheet, Image, TouchableOpacity,
  Button, Text, Alert, View} from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import {Icon, Overlay} from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';

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
  marker_modal_container: {
    flex: 1,
    alignItems: "center"
  },
  marker_modal_picture: {
    flex: 0.30,
    width: "100%",
    height: "100%"
  },
  marker_modal_title: {
    flex: 0.05,
    color: "#909090",
    fontWeight: "bold",
    fontSize: 24
  },
  marker_modal_like_container: {
    flex: 0.10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  marker_modal_like_text: {
    color: "#2195EE",
    fontSize: 16
  },
  marker_modal_text: {
    flex: 0.05,
    color: "#D3D3D3",
    fontSize: 16
  },
  marker_modal_description: {
    flex: 0.20,
    color: "#D3D3D3",
    fontSize: 16
  },
  marker_modal_btn: {
    flex: 0.075,
    width: "75%"
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
      loading: true,
      socket: undefined,
      marker_modal_id: -1,
      marker_modal_picture: "",
      marker_modal_title: "",
      marker_modal_author: "",
      marker_modal_category: "",
      marker_modal_likes: [],
      marker_modal_just_liked: false,
      marker_modal_expires: "",
      marker_modal_distance: "",
      marker_modal_description: "",
      marker_modal_visible: false,
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
    this.setState({
      socket: await io.connect(config.serverDomain + ":" + config.serverPort)
    });
  }

  // called whenever the component loads
  componentDidMount() {
    this.updateLocation();
  }

  // update the location of the user
  async updateLocation() {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      this.setState({loading: true});
      Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((position) => {
        // receive the markers from the server
        this.receiveMarkers(position);
        return;
      }).catch((error) => {
        this.setState({loading: false});
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
        // set the markers and update the current location
        this.setState({
          loading: false,
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          },
          locationDelta: {
            longitudeDelta: this.state.locationDelta.longitudeDelta,
            latitudeDelta: this.state.locationDelta.latitudeDelta
          },
          markers: JSON.parse(data.message)
        });
      } else {
        this.setState({loading: false});
        Alert.alert("Database Error!", data.message);
      }
    });
  }

  // add a like on the marker opened by the modal
  async addLike() {
    let authorToken = this.props.navigation.state.params.token;
    let markerId = this.state.marker_modal_id;

    // add the like if the user has not liked it
    let markerLikes = this.state.marker_modal_likes;
    if(!markerLikes.includes(authorToken)) {
      // update the like state
      markerLikes.push(authorToken);
      this.setState({
        marker_modal_likes: markerLikes,
        marker_modal_just_liked: true
      });

      // emit a message to like the marker
      this.state.socket.emit("addLike", {
        message: {
          author_token: authorToken,
          marker_id: markerId
        },
        handle: "addLike"
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
        <Spinner visible={this.state.loading} />
        <Overlay
          animationType="slide"
          fullScreen={true}
          isVisible={this.state.marker_modal_visible} >
            <View style={styles.marker_modal_container}>
              <Image
                style={styles.marker_modal_picture}
                source={{uri: this.state.marker_modal_picture}}
              />
              <Text style={styles.marker_modal_title}>
                {this.state.marker_modal_title}
              </Text>
              <View style={styles.marker_modal_like_container}>
                <Icon name="like" type="evilicon" color="#6986B0"
                  onPress={() => this.addLike()} size={36} />
                <Text style={styles.marker_modal_like_text}>
                  {this.state.marker_modal_likes.length}
                </Text>
              </View>
              <Text style={styles.marker_modal_text}>
                Pinged by {this.state.marker_modal_author}
              </Text>
              <Text style={styles.marker_modal_text}>
                Category: {this.state.marker_modal_category}
              </Text>
              <Text style={styles.marker_modal_text}>
                {this.state.marker_modal_expires}
              </Text>
              <Text style={styles.marker_modal_text}>
                Distance: {this.state.marker_modal_distance} ft
              </Text>
              <Text style={styles.marker_modal_description}>
                {this.state.marker_modal_description}
              </Text>
              <View style={styles.marker_modal_btn}>
                  <Button
                    color="#19A15F"
                    title="View Directions"
                  />
              </View>
              <View style={styles.marker_modal_btn}>
                  <Button
                    color="#DE4D3A"
                    title="Close"
                    onPress={() => this.closeMarkerModal()}
                  />
              </View>
            </View>
        </Overlay>
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
              title="You Are Here"
              coordinate={{
                longitude: this.state.location.longitude,
                latitude: this.state.location.latitude
              }} >
                <Icon name="person-pin-circle" type="material" color="#C1392B" size={40} />
            </MapView.Marker>
            {this.state.markers.map((marker, key) => (
              <MapView.Marker
                key={key}
                coordinate={{
                  longitude: marker.longitude,
                  latitude: marker.latitude
                }}
                onPress={() => this.openMarkerModal(marker)} >
                  {this.renderMarkerIcon(marker.category)}
              </MapView.Marker>
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

  // render the marker's icon based on its category
  renderMarkerIcon(category) {
    if(category == "Food") {
      return <Icon name="food" type="material-community" color="#FFB300" size={40} />;
    } else if(category == "Clothes") {
      return <Icon name="tshirt-crew-outline" type="material-community" color="#E4181B" size={40} />;
    } else if(category == "School") {
      return <Icon name="school" type="material-community" color="#FF7A1D" size={40} />;
    } else if(category == "Discounts") {
      return <Icon name="percent" type="feather" color="#3E9C35" size={40} />;
    } else if(category == "Party") {
      return <Icon name="drink" type="entypo" color="#BD8DE3" size={40} />;
    } else if(category == "Org Events") {
      return <Icon name="calendar" type="font-awesome" color="#2F74B5" size={40} />;
    } else if(category == "Emergencies") {
      return <Icon name="warning" type="font-awesome" color="#FFCC00" size={40} />;
    } else if(category == "Conctraceptives") {
      return <Icon name="heart" type="feather" color="#E793A0" size={40} />;
    } else if(category == "Other") {
      return <Icon name="rocket" type="simple-line-icon" color="#1F1F21" size={40} />;
    } else {
      return <Icon name="question" type="antdesign" color="#FF0000" size={40} />;
    }
  }

  // open the modal for a marker
  openMarkerModal(marker) {
    // dates
    let expiresDate = new Date(marker.expires).getTime();
    let currentDate = new Date().getTime();

    // time constants
    const msPerSecond = 1000;
    const sPerHour = 3600;
    const mPerHour = 60;
    const hPerDay = 24;

    // get each precise time until expiration
    let untilExpires = Math.abs(expiresDate - currentDate) / msPerSecond;
    let hours = Math.floor(untilExpires / sPerHour) % hPerDay;
    let minutes = Math.floor(untilExpires / mPerHour) % mPerHour;
    let expires = "Expires in " + hours + " hr and " + minutes + " min";
    if(hours <= 0 && minutes <= 0) {
      expires = "This ping has expired.";
    }

    // get the distance in feet
    const toFeet = 5280;
    let distanceFeet = Math.round(marker.distance * toFeet);

    // convert the modal likes into an Array
    let markerLikes = marker.likes;
    if(!markerLikes) {
      markerLikes = [];
    } else {
      markerLikes = JSON.parse(marker.likes);
    }

    // set the modal's state
    this.setState({
      marker_modal_id: marker.id,
      marker_modal_picture: marker.picture,
      marker_modal_title: marker.title,
      marker_modal_author: marker.author,
      marker_modal_category: marker.category,
      marker_modal_likes: markerLikes,
      marker_modal_just_liked: false,
      marker_modal_expires: expires,
      marker_modal_distance: distanceFeet,
      marker_modal_description: marker.description,
      marker_modal_visible: true
    });
  }

  // close the modal for a marker
  closeMarkerModal() {
    // update the location if the user just liked the marker
    if(this.state.marker_modal_just_liked) {
      this.updateLocation();
    }

    // close the modal
    this.setState({
      marker_modal_visible: false
    });
  }

  // go to a marker and load its modal
  goToMarker(marker) {
    // set the location to the marker's location
    this.setState({
      location: {
        longitude: marker.longitude,
        latitude: marker.latitude
      }
    });

    // open the modal
    this.openMarkerModal(marker);
  }

  // load the menu page
  loadMenuPage() {
    this.props.navigation.navigate("Menu");
  }

  // load the search page
  loadSearchPage() {
    // number of initial markers to load in the search page
    const loadMarkers = 10;

    this.props.navigation.navigate("Search", {
      socket: this.state.socket,
      markers: this.state.markers.slice(0, loadMarkers),
      goToMarker: this.goToMarker.bind(this)
    });
  }

  // load the pings page
  loadPingsPage() {
    this.props.navigation.navigate("Pings", {
      socket: this.state.socket,
      token: this.props.navigation.state.params.token,
      name: this.props.navigation.state.params.name,
      updateLocation: this.updateLocation.bind(this)
    });
  }
}
export default Home;
