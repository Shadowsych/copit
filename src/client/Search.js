// react packages
import React from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// styling packages
import {StyleSheet, ScrollView, SafeAreaView,
  ActivityIndicator, Text, Alert, View} from "react-native";
import {SearchBar, Icon, Button, Card} from 'react-native-elements';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  search_bar: {
    flex: 0.075,
    width: "100%"
  },
  picker_container: {
    flex: 0.125,
    width: "100%"
  },
  horizontal_scroll_view: {
    justifyContent: "center",
    alignItems: "center"
  },
  vertical_scroll_view: {
    flex: 0.70,
    width: "100%"
  },
  card: {
    borderRadius: 25
  },
  card_title: {
    color: "#C0C0C0"
  },
  card_like_container: {
    flexDirection: "row"
  },
  card_like_text: {
    color: "#909090",
    fontSize: 13,
    fontFamily: "ubuntu-regular"
  },
  card_text: {
    color: "#C0C0C0",
    marginBottom: 10,
    fontFamily: "ubuntu-regular"
  },
  card_btn: {
    backgroundColor: "#75B1DE",
    borderRadius: 15,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  go_back_container: {
    flex: 0.10,
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

class Search extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      markers: this.props.navigation.state.params.markers,
      search: "",
      category: "All Categories",
    }
  }

  // update the markers state
  async updateMarkers() {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    let currentPosition = undefined;
    if (status === "granted") {
      this.setState({loading: true});
      Location.getCurrentPositionAsync({enableHighAccuracy: true}).then((position) => {
        // set the current position
        currentPosition = position;
        this.searchMarkers(position);
        return;
      }).catch((error) => {
        this.setState({loading: false});
        Alert.alert("GPS Error!", "Please make sure your location (GPS) is turned on.");
      });
    }
  }

  // search for markers from the position
  async searchMarkers(position) {
    let socket = this.props.navigation.state.params.socket;

    // emit a message to search for specific markers
    socket.emit("searchMarkers", {
      message: {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        search: this.state.search,
        category: this.state.category
      },
      handle: "handleSearchMarkers"
    });

    // listen for the markers from the server
    socket.on("searchMarkers", (data) => {
      if(data.success) {
        // set the markers
        this.setState({
          markers: JSON.parse(data.message)
        });
      }
      this.setState({loading: false});
      socket.off("searchMarkers");
    });
  }

  // render the component's views
  render() {
    // gesture configuration
    const gestureConfig = {
      velocityThreshold: 0.10,
      directionalOffsetThreshold: 80
    };

    // miles to feet conversion rate
    const toFeet = 5280;

    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          containerStyle={styles.search_bar}
          placeholder="Search..."
          platform="android"
          onChangeText={(text) => this.setState({search: text})}
          onEndEditing={(text) => this.updateSearch()}
          value={this.state.search} />
        <View style={styles.picker_container}>
          <ScrollView contentContainerStyle={styles.horizontal_scroll_view} horizontal={true}>
            <Icon reverse name="globe" onPress={() => this.updateSearch("All Categories")}
              type="entypo" color="#333333" size={22} />
            <Icon reverse name="food" onPress={() => this.updateSearch("Food")}
              type="material-community" color="#FFB300" size={22} />
            <Icon reverse name="tshirt-crew-outline" onPress={() => this.updateSearch("Clothes")}
              type="material-community" color="#E4181B" size={22} />
            <Icon reverse name="school" onPress={() => this.updateSearch("School")}
              type="material-community" color="#FF7A1D" size={22} />
            <Icon reverse name="percent" onPress={() => this.updateSearch("Discounts")}
              type="feather" color="#3E9C35" size={22} />
            <Icon reverse name="drink" onPress={() => this.updateSearch("Party")}
              type="entypo" color="#BD8DE3" size={22} />
            <Icon reverse name="calendar" onPress={() => this.updateSearch("Org Events")}
              type="font-awesome" color="#2F74B5" size={22} />
            <Icon reverse name="warning" onPress={() => this.updateSearch("Emergencies")}
              type="font-awesome" color="#FFCC00" size={22} />
            <Icon reverse name="heart" onPress={() => this.updateSearch("Conctraceptives")}
              type="feather" color="#E793A0" size={22} />
            <Icon reverse name="rocket" onPress={() => this.updateSearch("Other")}
              type="simple-line-icon" color="#D9D9D9" size={22} />
          </ScrollView>
        </View>
        <ScrollView style={styles.vertical_scroll_view}>
          {this.state.markers.map((marker, key) => (
            <Card key={key} title={marker.title} titleStyle={styles.card_title}
              containerStyle={styles.card} image={{uri: marker.picture}}>
              <View style={styles.card_like_container}>
                <Icon name="heart" type="evilicon" color="#E84856" size={20} />
                <Text style={styles.card_like_text}>
                  {this.getFormattedLikes(marker.likes)}
                </Text>
              </View>
              <Text style={styles.card_text}>Pinged by {marker.author}</Text>
              <Text style={styles.card_text}>Category: {marker.category}</Text>
              <Text style={styles.card_text}>
                Distance: {Math.round(marker.distance * toFeet)} ft
              </Text>
              <Text style={styles.card_text}>{marker.description}</Text>
              <Button
                buttonStyle={styles.card_btn}
                onPress={
                  () => this.props.navigation.state.params.loadViewPingPage(
                    marker, this.updateMarkers.bind(this))
                }
                title="VIEW PING" />
            </Card>
          ))}
        </ScrollView>
        <View style={styles.go_back_container}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
        </View>
        {this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#CFD0D4" />
          </View>
        }
      </SafeAreaView>
    );
  }

  // update the search
  updateSearch(option) {
    // update the option state
    if(option) {
      this.setState({category: option});
    }

    // update the markers on the page
    this.updateMarkers();
  }

  // return the number likes
  getFormattedLikes(likes) {
    // convert the likes into an Array
    let markerLikes = likes;
    if(!markerLikes) {
      markerLikes = [];
    } else {
      markerLikes = JSON.parse(likes);
    }
    return markerLikes.length;
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Search;
