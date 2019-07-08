// react packages
import React from "react";
import {NavigationActions} from "react-navigation";

// styling packages
import {StyleSheet, AsyncStorage, Image, SafeAreaView,
  Text, TouchableOpacity, View} from "react-native";
import {Avatar, Divider, ListItem, Icon} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';

// config packages
import guestConfig from "../../../../config/accounts/guest.json";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  navbar: {
    flex: 0.15,
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  navbar_small_spacing: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  navbar_large_spacing: {
    flex: 0.35
  },
  points_text: {
    color: "#929497",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  list_view: {
    flex: 0.875,
    width: "100%"
  },
  list_item_title: {
    color: "#6A6F73",
    fontFamily: "ubuntu-regular"
  },
  list_item_subtitle: {
    color: "#6A6F73",
    fontFamily: "ubuntu-regular"
  },
  logout_btn: {
    flex: 0.075,
    width: "100%",
    backgroundColor: "#75B1DE",
    alignItems: "center",
    justifyContent: "center"
  },
  logout_text: {
    color: "white",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  }
});

class Menu extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      points: "..."
    }
  }

  // called whenever the component loads
  componentDidMount() {
    this.receivePoints();
  }

  // receive the points of this account
  async receivePoints() {
    let socket = this.props.navigation.state.params.socket;

    // send an emit to receive the points
    this.setState({loading: true});
    socket.emit("receivePoints", {
      message: {
        id: this.props.navigation.state.params.id,
        token: this.props.navigation.state.params.token
      },
      handle: "handleReceivePoints"
    });

    // listen for the edit account response from the server
    socket.on("receivePoints", (data) => {
      this.setState({loading: false});
      if(data.success) {
        // set the points state
        this.setState({points: data.message.points});
      }
      socket.off("receivePoints");
    });
  }

  // render the component's views
  render() {
    // is the user a guest
    let isGuest = this.props.navigation.state.params.id == guestConfig.id;

    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} />
        <View style={styles.navbar}>
          <View style={styles.navbar_small_spacing}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
          <View style={styles.navbar_large_spacing} />
          <View>
            <Avatar rounded icon={{name: "camera-off", type: "feather"}} activeOpacity={0.7}
              size="large" source={{uri: this.props.navigation.state.params.profile_photo}} />
          </View>
          <View style={styles.navbar_large_spacing} />
          <View style={styles.navbar_small_spacing}>
            <Icon name="medal" type="entypo" color="#75B1DE" size={22} />
            <Text style={styles.points_text}>{this.state.points}</Text>
          </View>
        </View>
        <View style={styles.list_view}>
          <ListItem
          title={"Account" + ((isGuest) ? " (Disabled for Guests)" : "")}
          titleStyle={styles.list_item_title}
          subtitle="Edit name, picture, password, etc."
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "user", type: "antdesign", color: ((isGuest) ? "#C7D0D7" : "#75B1DE")}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          disabled={isGuest}
          onPress={() => this.loadEditAccountPage()}
          />
          <ListItem
          title={"Pings" + ((isGuest) ? " (Disabled for Guests)" : "")}
          titleStyle={styles.list_item_title}
          subtitle={"Edit name, description, picture, etc."}
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "globe", type: "entypo", color: ((isGuest) ? "#C7D0D7" : "#75B1DE")}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          disabled={isGuest}
          onPress={() => this.loadMyPingsPage()}
          />
          <ListItem
          title="Leaderboards"
          titleStyle={styles.list_item_title}
          subtitle="View users with the highest points."
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "trophy", type: "simple-line-icon", color: "#75B1DE"}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          onPress={() => this.loadLeaderboardsPage()}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.logOut()}
          activeOpacity={0.8}
          style={styles.logout_btn}>
          <Text style={styles.logout_text}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }

  // load the edit account page
  loadEditAccountPage() {
    let socket = this.props.navigation.state.params.socket;

    // navigate to the account page
    this.props.navigation.navigate("EditAccount", {
      socket: socket,
      id: this.props.navigation.state.params.id,
      token: this.props.navigation.state.params.token,
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      profile_photo: this.props.navigation.state.params.profile_photo,
      removeWatch: this.props.navigation.state.params.removeWatch
    });
  }

  // load the my pings page
  loadMyPingsPage() {
    let socket = this.props.navigation.state.params.socket;

    // navigate to the my pings page
    this.props.navigation.navigate("MyPings", {
      socket: socket,
      id: this.props.navigation.state.params.id,
      token: this.props.navigation.state.params.token,
      name: this.props.navigation.state.params.name,
      updateMarkers: this.props.navigation.state.params.updateMarkers
    });
  }

  // load the leaderboards page
  loadLeaderboardsPage() {
    let socket = this.props.navigation.state.params.socket;

    // navigate to the leaderboards page
    this.props.navigation.navigate("Leaderboards", {
      socket: socket
    });
  }

  // logout the account
  logOut() {
    let socket = this.props.navigation.state.params.socket;

    // unwatch the location
    this.props.navigation.state.params.removeWatch();

    // remove the token stored in the storage
    AsyncStorage.removeItem("token");

    // pop the navigation stack, then navigate back to the Login screen
    this.props.navigation.reset([
       NavigationActions.navigate({
         routeName: "Login",
         params: {socket: socket}
       })], 0
    );
  }
}
export default Menu;
