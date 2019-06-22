// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, Text, TouchableOpacity, View} from "react-native";
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
  picture_btn: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "center"
  },
  upload_picture: {
    width: 150,
    height: 150
  }
});

class Ping extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      upload_picture: "http://cdn.onlinewebfonts.com/svg/img_234957.png"
    }
  }

  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
          <Text style={styles.title_text}>
            {this.props.navigation.state.params.category}
          </Text>
        </Header>
        <TouchableOpacity activeOpacity={0.8} style={styles.picture_btn}>
          <Image
            style={styles.upload_picture}
            source={{uri: this.state.upload_picture}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Ping;
