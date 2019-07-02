// react packages
import React from "react";

// maps packages
import {showLocation} from "react-native-map-link";

// styling packages
import {StyleSheet, SafeAreaView, Image, Text, View} from "react-native";
import {Divider, Button, Icon} from "react-native-elements";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  spacing: {
    flex: 0.025
  },
  picture: {
    flex: 0.275,
    width: "100%",
    height: "100%"
  },
  header: {
    flex: 0.050,
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  title: {
    flex: 0.85,
    color: "#909090",
    fontSize: 24,
    fontFamily: "ubuntu-regular",
  },
  like_container: {
    flex: 0.15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  like_text: {
    color: "#909090",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  text_info_container: {
    flex: 0.475
  },
  text_container: {
    flex: 0.15,
    flexDirection: "row"
  },
  text: {
    alignSelf: "flex-start",
    marginLeft: 10,
    color: "#D3D3D3",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  divider: {
    flex: 0.05
  },
  description_container: {
    flex: 0.50
  },
  description: {
    alignSelf: "flex-start",
    color: "#D3D3D3",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  directions_btn_container: {
    flex: 0.075,
    width: "90%"
  },
  directions_btn: {
    backgroundColor: "#75B1DE",
    borderRadius: 10
  }
});

class ViewPing extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.marker_params.id,
      picture: this.props.marker_params.picture,
      title: this.props.marker_params.title,
      longitude: this.props.marker_params.longitude,
      latitude: this.props.marker_params.latitude,
      author: this.props.marker_params.author,
      category: this.props.marker_params.category,
      likes: this.props.marker_params.likes,
      expires: this.props.marker_params.expires,
      distance: this.props.marker_params.distance,
      description: this.props.marker_params.description,
    }
  }

  // add a like on the marker
  async addLike() {
    let userId = this.props.marker_params.user_id;
    let userToken = this.props.marker_params.user_token;
    let markerId = this.state.id;

    // add the like if the user has not liked it
    let markerLikes = this.state.likes;
    if(!markerLikes.includes(userId)) {
      // update the like state
      markerLikes.push(userId);
      this.setState({
        likes: markerLikes
      });

      // emit a message to like the marker
      let socket = this.props.marker_params.socket;
      socket.emit("addLike", {
        message: {
          user_id: userId,
          user_token: userToken,
          marker_id: markerId
        },
        handle: "addLike"
      });

      // receive an add likes response from the server
      socket.on("addLike", (data) => {
        if(data.success) {
          let updateAllMarkers = this.props.marker_params.updateAllMarkers;

          // call each Array of functions to update the markers state
          for(let updateIndex = 0; updateIndex < updateAllMarkers.length; updateIndex++) {
            let updateMarkers = updateAllMarkers[updateIndex];
            updateMarkers();
          }
        }
        socket.off("addLike");
      });
    }
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.spacing} />
        <Image
          style={styles.picture}
          source={{uri: this.state.picture}}
        />
        <View style={styles.spacing} />
        <View style={styles.header}>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
          <View style={styles.like_container}>
            <Icon name="heart" type="evilicon" color="#E84856"
              onPress={() => this.addLike()} size={24} />
            <Text style={styles.like_text}>
              {this.state.likes.length}
            </Text>
          </View>
        </View>
        <View style={styles.spacing} />
        <View style={styles.spacing} />
        <View style={styles.text_info_container}>
          <View style={styles.text_container}>
            <Icon name="user" type="antdesign" color="#75B1DE" size={20} />
            <Text style={styles.text}>
              Pinged by {this.state.author}
            </Text>
          </View>
          <View style={styles.text_container}>
            <Icon name="globe" type="entypo" color="#75B1DE" size={20} />
            <Text style={styles.text}>
              Category: {this.state.category}
            </Text>
          </View>
          <View style={styles.text_container}>
            <Icon name="hourglass" type="antdesign" color="#75B1DE" size={20} />
            <Text style={styles.text}>
              {this.state.expires}
              </Text>
          </View>
          <View style={styles.divider}><Divider /></View>
          <View style={styles.description_container}>
            <Text style={styles.description}>
              {this.state.description}
              </Text>
          </View>
        </View>
        <View style={styles.directions_btn_container}>
          <Button
            buttonStyle={styles.directions_btn}
            onPress={() => this.viewDirections()}
            title={"DIRECTIONS (" + this.state.distance + " FT)"} />
        </View>
        <View style={styles.spacing} />
      </SafeAreaView>
    );
  }

  // view the directions to the marker
  viewDirections() {
    showLocation({
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      appsWhiteList: ["google-maps", "apple-maps"]
    });
  }
}
export default ViewPing;
