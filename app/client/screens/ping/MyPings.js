// react packages
import React from "react";

// styling packages
import {StyleSheet, ScrollView, Alert, Image,
  RefreshControl, Text, View, SafeAreaView} from "react-native";
import {Icon, Button, Header, Card} from 'react-native-elements';

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
  vertical_scroll_view: {
    flex: 0.95,
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
  }
});

class MyPings extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      markers: []
    }
  }

  // called whenever the component loads
  componentDidMount() {
    this.receiveMyMarkers();
  }

  //
  async receiveMyMarkers() {
    let socket = this.props.navigation.state.params.socket;

    // emit a message to search for specific markers
    this.setState({loading: true});
    socket.emit("receiveMyMarkers", {
      message: {
        id: this.props.navigation.state.params.id,
        token: this.props.navigation.state.params.token
      },
      handle: "handleReceiveMyMarkers"
    });

    // listen for the markers from the server
    socket.on("receiveMyMarkers", (data) => {
      if(data.success) {
        // set the markers
        this.setState({
          markers: JSON.parse(data.message)
        });
      } else {
        Alert.alert("My Active Pings Error!", data.message);
      }
      this.setState({loading: false});
      socket.off("receiveMyMarkers");
    });
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
          <Text style={styles.title_text}>My Active Pings</Text>
        </Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              colors={["#75B1DE"]}
              onRefresh={() => this.receiveMyMarkers()}
            />
          }
          style={styles.vertical_scroll_view}>
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
              <Text style={styles.card_text}>{this.getExpirationTime(marker)}</Text>
              <Text style={styles.card_text}>{marker.description}</Text>
              <Button
                buttonStyle={styles.card_btn}
                onPress={() => this.loadEditPingPage(marker)}
                title="EDIT PING" />
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
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

  // return the expiration time of a marker
  getExpirationTime(marker) {
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
    return expires;
  }

  // load the edit ping page
  loadEditPingPage(marker) {

  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default MyPings;
