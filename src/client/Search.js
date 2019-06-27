// react packages
import React from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

// styling packages
import {StyleSheet, Picker, ScrollView,
  ActivityIndicator, Text, Alert, View} from "react-native";
import {SearchBar, Icon, Button, Card} from 'react-native-elements';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  search_bar: {
    flex: 0.10,
    width: "100%"
  },
  picker: {
    flex: 0.10,
    width: "75%"
  },
  item: {
    fontFamily: "ubuntu-regular"
  },
  scroll_view: {
    flex: 0.70,
    width: "100%"
  },
  card_title: {
    color: "#C0C0C0"
  },
  card_text: {
    color: "#C0C0C0",
    marginBottom: 10,
    fontFamily: "ubuntu-regular"
  },
  card_btn: {
    backgroundColor: "#75B1DE",
    borderRadius: 0,
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
      category: "",
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
        <View style={styles.container}>
          <SearchBar
            containerStyle={styles.search_bar}
            placeholder="Search..."
            platform="android"
            onChangeText={(text) => this.setState({search: text})}
            onEndEditing={(text) => this.updateSearch()}
            value={this.state.search} />
          <Picker
            style={styles.picker}
            selectedValue={this.state.category}
            onValueChange={(option) => this.updateSearch(option)}>
             <Picker.Item itemStyle={styles.item} color="#C0C0C0" label="All Categories" value="All Categories" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Food" value="Food" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Clothes" value="Clothes" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Clothes" value="Clothes" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="School" value="School" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Discounts" value="Discounts" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Party" value="Party" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Org Events" value="Org Events" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Emergencies" value="Emergencies" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Conctraceptives" value="Conctraceptives" />
             <Picker.Item itemStyle={styles.item} color="#909090" label="Other" value="Other" />
          </Picker>
          <ScrollView style={styles.scroll_view}>
            {this.state.markers.map((marker, key) => (
              <Card
                key={key}
                title={marker.title}
                titleStyle={styles.card_title}
                image={{uri: marker.picture}}>
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
        </View>
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

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Search;
