// react packages
import React from "react";

// styling packages
import {StyleSheet, Alert, Image, View, SafeAreaView} from "react-native";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class EditPing extends React.Component {
  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
    );
  }
}
export default EditPing;
