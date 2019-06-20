// react packages
import React from "react";

// styling packages
import {StyleSheet, Picker, ScrollView, Text, View} from "react-native";
import {SearchBar, Icon, Button, Card} from 'react-native-elements';
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
  go_back_container: {
    flex: 0.10,
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "center"
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
             <Picker.Item color="#909090" label="Food" value="Food" />
             <Picker.Item color="#909090" label="Clothes" value="Clothes" />
             <Picker.Item color="#909090" label="Clothes" value="Clothes" />
             <Picker.Item color="#909090" label="School" value="School" />
             <Picker.Item color="#909090" label="Discounts" value="Discounts" />
             <Picker.Item color="#909090" label="Party" value="Party" />
             <Picker.Item color="#909090" label="Org Events" value="Org Events" />
             <Picker.Item color="#909090" label="Emergencies" value="Emergencies" />
             <Picker.Item color="#909090" label="Conctraceptives" value="Conctraceptives" />
             <Picker.Item color="#909090" label="Other" value="Other" />
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
          <View style={styles.go_back_container}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
        </View>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Search;
