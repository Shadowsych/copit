// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Dimensions, Text, Button, View} from "react-native";
import {Icon} from "react-native-elements";

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
    width: Dimensions.get("window").width * 0.90,
    height: "100%"
  },
  title: {
    flex: 0.05,
    color: "#909090",
    fontWeight: "bold",
    fontSize: 24
  },
  like_container: {
    flex: 0.10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  like_text: {
    color: "#2195EE",
    fontSize: 16
  },
  text: {
    flex: 0.05,
    color: "#D3D3D3",
    fontSize: 16
  },
  description: {
    flex: 0.20,
    color: "#D3D3D3",
    fontSize: 16
  },
  btn: {
    flex: 0.075,
    width: "75%"
  }
});

class ViewPing extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.navigation.state.params.socket,
      id: this.props.navigation.state.params.id,
      picture: this.props.navigation.state.params.picture,
      title: this.props.navigation.state.params.title,
      author: this.props.navigation.state.params.author,
      category: this.props.navigation.state.params.category,
      likes: this.props.navigation.state.params.likes,
      expires: this.props.navigation.state.params.expires,
      distance: this.props.navigation.state.params.distance,
      description: this.props.navigation.state.params.description,
    }
  }

  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.spacing}></View>
        <Image
          style={styles.picture}
          source={{uri: this.state.picture}}
        />
        <Text style={styles.title}>
          {this.state.title}
        </Text>
        <View style={styles.like_container}>
          <Icon name="like" type="evilicon" color="#6986B0"
            onPress={() => this.addLike()} size={36} />
          <Text style={styles.like_text}>
            {this.state.likes.length}
          </Text>
        </View>
        <Text style={styles.text}>
          Pinged by {this.state.author}
        </Text>
        <Text style={styles.text}>
          Category: {this.state.category}
        </Text>
        <Text style={styles.text}>
          {this.state.expires}
        </Text>
        <Text style={styles.text}>
          Distance: {this.state.distance} ft
        </Text>
        <Text style={styles.description}>
          {this.state.description}
        </Text>
        <View style={styles.btn}>
            <Button
              color="#19A15F"
              title="View Directions"
              onPress={() => this.viewDirections()}
            />
        </View>
        <View style={styles.btn}>
            <Button
              color="#DE4D3A"
              title="Close"
              onPress={() => this.goBackPage()}
            />
        </View>
      </View>
    );
  }

  // add a like on the marker
  async addLike() {
    let userId = this.props.navigation.state.params.user_id;
    let userToken = this.props.navigation.state.params.user_token;
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
      this.state.socket.emit("addLike", {
        message: {
          user_id: userId,
          user_token: userToken,
          marker_id: markerId
        },
        handle: "addLike"
      });
    }
  }

  // view the directions to the marker
  viewDirections() {

  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default ViewPing;
