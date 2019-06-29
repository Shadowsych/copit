// react packages
import React from "react";
import {NavigationActions} from "react-navigation";

// styling packages
import {StyleSheet, AsyncStorage, Image, SafeAreaView,
  Text, TouchableOpacity, View} from "react-native";
import {Avatar, Divider, ListItem, Icon} from "react-native-elements";

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
  small_spacing: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  large_spacing: {
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
      points: this.props.navigation.state.params.points
    }
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.small_spacing}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
          <View style={styles.large_spacing}></View>
          <View>
            <Avatar rounded icon={{name: "camera-off", type: "feather"}} activeOpacity={0.7}
              size="large" source={{uri: this.props.navigation.state.params.profile_photo}} />
          </View>
          <View style={styles.large_spacing} />
          <View style={styles.small_spacing}>
            <Icon name="trophy" type="simple-line-icon" color="#75B1DE" size={22} />
            <Text style={styles.points_text}>{this.state.points}</Text>
          </View>
        </View>
        <View style={styles.list_view}>
          <ListItem
          title="Account"
          titleStyle={styles.list_item_title}
          subtitle="Edit name, picture, password, etc."
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "user", type: "antdesign", color: "#75B1DE"}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          onPress={() => this.loadAccountPage()}
          />
          <ListItem
          title="Pings"
          titleStyle={styles.list_item_title}
          subtitle={"Edit name, description, picture, etc."}
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "globe", type: "entypo", color: "#75B1DE"}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          onPress={() => this.loadMyPingsPage()}
          />
          <ListItem
          title="Points Shop"
          titleStyle={styles.list_item_title}
          subtitle="Redeem in-app rewards."
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "shoppingcart", type: "antdesign", color: "#75B1DE"}}
          rightIcon={{name: "chevron-right", type: "fontawesome", color: "#C7D0D7"}}
          onPress={() => this.loadPointsShopPage()}
          />
          <ListItem
          title="Leaderboards"
          titleStyle={styles.list_item_title}
          subtitle="View users with the highest points."
          subtitleStyle={styles.list_item_subtitle}
          leftIcon={{name: "medal", type: "entypo", color: "#75B1DE"}}
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

  // load the account page
  loadAccountPage() {
    let socket = this.props.navigation.state.params.socket;

    // navigate to the account page
    this.props.navigation.navigate("Account", {
      socket: socket
    });
  }

  // load the my pings page
  loadMyPingsPage() {
    let socket = this.props.navigation.state.params.socket;
  }

  // load the points shop page
  loadPointsShopPage() {
    let socket = this.props.navigation.state.params.socket;
  }

  // load the leaderboards page
  loadLeaderboardsPage() {
    let socket = this.props.navigation.state.params.socket;
  }

  // logout the account
  logOut() {
    let socket = this.props.navigation.state.params.socket;

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
