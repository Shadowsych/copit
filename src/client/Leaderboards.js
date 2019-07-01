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
    this.receiveGlobalLeaderboards();
  }

  // receive the global leaderboards
  async receiveGlobalLeaderboards() {
    let socket = this.props.navigation.state.params.socket;
    
    // emit a message to receive global leaderboards
    socket.emit("receiveGlobalLeaderboards", {
      message: "Receive the global leaderboards",
      handle: "handleLoadAccount"
    });

    // listen for a response from the server
    socket.on("receiveGlobalLeaderboards", (data) => {
      if(data.success) {
        // set the leaderboards
        this.setState({
          leaderboards: JSON.parse(data.message)
        });
      } else {
        console.log(data.message);
      }
      socket.off("receiveGlobalLeaderboards");
    });
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
            leftAvatar={{
              source: {uri: account.profile_photo}
            }}
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
