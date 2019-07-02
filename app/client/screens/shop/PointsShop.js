// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Text, SafeAreaView, View} from "react-native";
import {Header, Button, Icon} from "react-native-elements";

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
  points_container: {
    justifyContent: "center",
    alignItems: "center"
  },
  points_text: {
    color: "#929497",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  }
});

class PointsShop extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      points: this.props.navigation.state.params.points,
      points_shop: []
    }
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
          <Text style={styles.title_text}>Points Shop</Text>
          <View style={styles.points_container}>
            <Icon name="medal" type="entypo" color="#75B1DE" size={22} />
            <Text style={styles.points_text}>{this.state.points}</Text>
          </View>
        </Header>
      </SafeAreaView>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default PointsShop;
