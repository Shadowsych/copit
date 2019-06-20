// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Text, View} from "react-native";
import {Icon} from "react-native-elements";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
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
        <View style={styles.row}>
          <View style={styles.column}>
            <Icon reverse name="food" type="material-community"
              color="#FFB300" size={48} />
            <Text style={styles.icon_text}>Food</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="tshirt-crew-outline" type="material-community"
              color="#E4181B" size={48} />
            <Text style={styles.icon_text}>Clothes</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="school" type="material-community"
              color="#FF7A1D" size={48} />
            <Text style={styles.icon_text}>School</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Icon reverse name="percent" type="feather"
              color="#3E9C35" size={48} />
            <Text style={styles.icon_text}>Discounts</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="drink" type="entypo"
              color="#BD8DE3" size={48} />
            <Text style={styles.icon_text}>Party</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="calendar" type="font-awesome"
              color="#2F74B5" size={48} />
            <Text style={styles.icon_text}>Org Events</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Icon reverse name="warning" type="font-awesome"
              color="#FFCC00" size={48} />
            <Text style={styles.icon_text}>Emergencies</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="heart" type="feather"
              color="#E793A0" size={48} />
            <Text style={styles.icon_text}>Conctraceptives</Text>
          </View>
          <View style={styles.column}>
            <Icon reverse name="rocket" type="simple-line-icon"
              color="#D9D9D9" size={48} />
            <Text style={styles.icon_text}>Other</Text>
          </View>
        </View>
      </View>
    );
  }
}
export default Pings;
