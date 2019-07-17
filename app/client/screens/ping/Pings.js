// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Platform, Text, SafeAreaView, View} from "react-native";
import {Icon} from "react-native-elements";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navbar: {
    flex: 0.10,
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
  title_text: {
    color: "#D3D3D3",
    fontSize: 24,
    fontFamily: "ubuntu-regular"
  },
  grid_container: {
    flex: 0.90
  },
  row: {
    flex: 0.333,
    flexDirection: "row",
    alignItems: "center"
  },
  column: {
    flex: 0.333,
    alignItems: "center",
    justifyContent: "center"
  },
  icon_text: {
    color: "#D3D3D3",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  }
});

class Pings extends React.Component {
  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.navbar_small_spacing}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
          <View style={styles.navbar_large_spacing} />
          <Text style={styles.title_text}>Add Ping</Text>
          <View style={styles.navbar_large_spacing} />
          <View style={styles.navbar_small_spacing} />
        </View>
        <View style={styles.grid_container}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Icon reverse name="food" onPress={() => this.goPingPage("Food")}
                type="material-community" color="#FFB300" size={48} />
              <Text style={styles.icon_text}>Food</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="tshirt-crew-outline" onPress={() => this.goPingPage("Clothes")}
                type="material-community" color="#E4181B" size={48} />
              <Text style={styles.icon_text}>Clothes</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="school" onPress={() => this.goPingPage("School")}
                type="material-community" color="#FF7A1D" size={48} />
              <Text style={styles.icon_text}>School</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Icon reverse name="ios-american-football" onPress={() => this.goPingPage("Sports")}
                type="ionicon" color="#3E9C35" size={48} />
              <Text style={styles.icon_text}>Sports</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="drink" onPress={() => this.goPingPage("Party")}
                type="entypo" color="#BD8DE3" size={48} />
              <Text style={styles.icon_text}>Party</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="calendar" onPress={() => this.goPingPage("Org Events")}
                type="font-awesome" color="#2F74B5" size={48} />
              <Text style={styles.icon_text}>Org Events</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Icon reverse name="warning" onPress={() => this.goPingPage("Emergencies")}
                type="font-awesome" color="#FFCC00" size={48} />
              <Text style={styles.icon_text}>Emergencies</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="heart" onPress={() => this.goPingPage("Conctraceptives")}
                type="feather" color="#E793A0" size={48} />
              <Text style={styles.icon_text}>Conctraceptives</Text>
            </View>
            <View style={styles.column}>
              <Icon reverse name="rocket" onPress={() => this.goPingPage("Other")}
                type="simple-line-icon" color="#D9D9D9" size={48} />
              <Text style={styles.icon_text}>Other</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }

  // go to the ping page
  goPingPage(category) {
    let socket = this.props.navigation.state.params.socket;
    this.props.navigation.navigate("AddPing", {
      category: category,
      socket: socket,
      id: this.props.navigation.state.params.id,
      token: this.props.navigation.state.params.token,
      name: this.props.navigation.state.params.name,
      updateMarkers: this.props.navigation.state.params.updateMarkers
    });
  }
}
export default Pings;
