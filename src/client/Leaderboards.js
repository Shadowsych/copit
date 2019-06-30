// react packages
import React from "react";

// styling packages
import {StyleSheet, ScrollView, Image, View, Text, SafeAreaView} from "react-native";
import {Header, ListItem, Icon} from "react-native-elements";

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
  spacing: {
    flex: 0.025
  },
  leaderboards: {
    flex: 0.925,
    width: "100%"
  },
  leaderboard_title: {
    color: "#6A6F73",
    fontFamily: "ubuntu-regular"
  },
  leaderboard_subtitle: {
    fontFamily: "ubuntu-regular"
  }
});

class Leaderboards extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      leaderboards: []
    }
  }

  // called whenever the component loads
  componentDidMount() {
    let socket = this.props.navigation.state.params.socket;
    
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header containerStyle={styles.navbar}>
          <Icon name="chevron-left" onPress={() => this.goBackPage()}
            type="entypo" color="#D3D3D3" size={22} />
          <Text style={styles.title_text}>Global</Text>
        </Header>
        <View style={styles.spacing} />
        <ScrollView style={styles.leaderboards}>
          {this.state.leaderboards.map((account, key) => (
            <ListItem
            key={key}
            title={(key + 1) + ". " + account.name}
            titleStyle={styles.leaderboard_title}
            subtitle={account.points + " Points"}
            subtitleStyle={styles.leaderboard_subtitle}
            leftIcon={{name: "staro", type: "antdesign", color: "#75B1DE"}}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // go back a page
  goBackPage() {
    this.props.navigation.goBack();
  }
}
export default Leaderboards;
