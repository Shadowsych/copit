// react packages
import React from "react";
import {NavigationActions} from 'react-navigation';

// styling packages
import {StyleSheet, Picker, ScrollView, Text, View} from "react-native";
import {SearchBar, Icon, Button, Card} from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as Animatable from 'react-native-animatable';

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  search_bar: {
    flex: 0.10,
    width: "100%"
  },
  picker: {
    flex: 0.10,
    width: "75%"
  },
  scroll_view: {
    flex: 0.70,
    width: "100%"
  },
  card_title: {
    color: "#C0C0C0"
  },
  card_text: {
    color: "#C0C0C0",
    marginBottom: 10
  },
  card_btn: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  swipe_up_container: {
    flex: 0.10,
    alignItems: "center",
    justifyContent: "center"
  },
  swipe_up_text: {
    color: "#75B1DE",
    fontWeight: "bold",
    fontSize: 12
  }
});

class Search extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      category: "",
    }
  }

  // render the component's views
  render() {
    // gesture configuration
    const gestureConfig = {
      velocityThreshold: 0.10,
      directionalOffsetThreshold: 80
    };

    return (
        <View style={styles.container}>
          <SearchBar
            containerStyle={styles.search_bar}
            placeholder="Search..."
            platform="android"
            onChangeText={(text) => this.setState({search: text})}
            value={this.state.search}
          />
          <Picker
            style={styles.picker}
            selectedValue={this.state.category}
            onValueChange={(option) => this.setState({category: option})}>
             <Picker.Item color="#C0C0C0" label="All Categories" value="All Categories" />
             <Picker.Item color="#C0C0C0" label="Food" value="Food" />
             <Picker.Item color="#C0C0C0" label="Clothes" value="Clothes" />
             <Picker.Item color="#C0C0C0" label="Clothes" value="Clothes" />
             <Picker.Item color="#C0C0C0" label="School" value="School" />
             <Picker.Item color="#C0C0C0" label="Discounts" value="Discounts" />
             <Picker.Item color="#C0C0C0" label="Party" value="Party" />
             <Picker.Item color="#C0C0C0" label="Org Events" value="Org Events" />
             <Picker.Item color="#C0C0C0" label="Emergencies" value="Emergencies" />
             <Picker.Item color="#C0C0C0" label="Conctraceptives" value="Conctraceptives" />
             <Picker.Item color="#C0C0C0" label="Other" value="Other" />
          </Picker>
          <ScrollView style={styles.scroll_view}>
            <Card
              title="Testing"
              titleStyle={styles.card_title}
              image={require("../../assets/icon.png")}>
                <Text style={styles.card_text}>
                  This is for testing purposes.
                </Text>
                <Button
                  backgroundColor="#1C7ED7"
                  buttonStyle={styles.card_btn}
                  title="VIEW PING" />
            </Card>
            <Card
              title="Testing"
              titleStyle={styles.card_title}
              image={require("../../assets/icon.png")}>
                <Text style={styles.card_text}>
                  This is for testing purposes.
                </Text>
                <Button
                  backgroundColor="#1C7ED7"
                  buttonStyle={styles.card_btn}
                  title="VIEW PING" />
            </Card>
          </ScrollView>
          <GestureRecognizer
            onSwipeUp={() => this.goBackPage()}
            config={gestureConfig}
            style={styles.swipe_up_container}>
              <Animatable.View animation="pulse" iterationCount="infinite">
                <Text style={styles.swipe_up_text}>Swipe to go back!</Text>
                <Icon name="arrow-up" type="feather" color="#1C7ED7" />
              </Animatable.View>
          </GestureRecognizer>
        </View>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.dispatch(NavigationActions.back());
  }
}
export default Search;
