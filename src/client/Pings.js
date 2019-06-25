// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Text, View} from "react-native";
import {Header, Icon} from "react-native-elements";

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
    fontWeight: "bold",
    fontSize: 24
  },
  grid_container: {
    flex: 0.95
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
    fontWeight: "bold",
    fontSize: 16
  }
});

class Pings extends React.Component {
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
          <Text style={styles.title_text}>Add Ping</Text>
        </Header>
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
              <Icon reverse name="percent" onPress={() => this.goPingPage("Discounts")}
                type="feather" color="#3E9C35" size={48} />
              <Text style={styles.icon_text}>Discounts</Text>
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
      </View>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }

  // go to the ping page
  goPingPage(category) {
    this.props.navigation.navigate("AddPing", {
      category: category,
      socket: this.props.navigation.state.params.socket,
      id: this.props.navigation.state.params.id,
      token: this.props.navigation.state.params.token,
      name: this.props.navigation.state.params.name,
      updateLocation: this.props.navigation.state.params.updateLocation
    });
  }
}
export default Pings;
