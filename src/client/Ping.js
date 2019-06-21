// react packages
import React from "react";

// styling packages
import {StyleSheet, Image, View} from "react-native";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Ping extends React.Component {
  // render the component's views
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}
export default Ping;
