// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, View} from "react-native";
import * as Animatable from 'react-native-animatable';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 150,
    height: 150
  }
});

class Loading extends React.Component {
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
        <Animatable.Image
          style={styles.logo}
          animation="bounceIn"
          onAnimationEnd={() => this.loadLoginPage()}
          source={require("../../assets/icon.png")}/>
      </View>
    );
  }

  // load the login page after waiting a few second(s)
  loadLoginPage() {
    const waitTime = 1000;
    setTimeout(() => {
      this.props.navigation.navigate("Login");
    }, waitTime);
  }
}
export default Loading;
