// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Text, TouchableOpacity, View} from "react-native";
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
    flex: 0.15
  },
  large_spacing: {
    flex: 0.35
  },
  list_view: {
    flex: 0.875
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
    fontWeight: "bold",
    fontSize: 16
  }
});

class Menu extends React.Component {
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.small_spacing}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
          <View style={styles.large_spacing}></View>
          <Avatar rounded size="large" title="?" activeOpacity={0.7} />
          <View style={styles.large_spacing}></View>
          <View style={styles.small_spacing}></View>
        </View>
        <View style={styles.list_view}>
        </View>
        <TouchableOpacity
          onPress={() => this.logOut()}
          activeOpacity={0.8}
          style={styles.logout_btn}>
            <Text style={styles.logout_text}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }

  // logout the page
  logOut() {
    
  }
}
export default Menu;
