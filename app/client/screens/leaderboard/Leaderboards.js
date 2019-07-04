// react packages
import React from "react";

// styling packages
import {StyleSheet, ScrollView, RefreshControl, Platform,
  Image, View, Text, SafeAreaView} from "react-native";
import {ListItem, Icon} from "react-native-elements";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navbar: {
    flex: 0.125,
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  navbar_small_spacing: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  navbar_large_spacing: {
    flex: 0.35
  },
  title_text: {
    color: "#D3D3D3",
    fontSize: 24,
    fontFamily: "ubuntu-regular"
  },
  leaderboards: {
    flex: 0.875,
    width: "100%"
  },
  leaderboard_title: {
    color: "#6A6F73",
    fontFamily: "ubuntu-regular"
  },
  leaderboard_subtitle: {
    color: "#6A6F73",
    fontFamily: "ubuntu-regular"
  }
});

class Leaderboards extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
    this.setState({loading: true});
    socket.emit("receiveGlobalLeaderboards", {
      message: "Receive the global leaderboards",
      handle: "handleLoadAccount"
    });

    // listen for a response from the server
    socket.on("receiveGlobalLeaderboards", (data) => {
      this.setState({loading: false});
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
        <View style={styles.navbar}>
          <View style={styles.navbar_small_spacing}>
            <Icon name="chevron-left" onPress={() => this.goBackPage()}
              type="entypo" color="#D3D3D3" size={22} />
          </View>
          <View style={styles.navbar_large_spacing} />
          <Text style={styles.title_text}>Global</Text>
          <View style={styles.navbar_large_spacing} />
          <View style={styles.navbar_small_spacing} />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              colors={["#75B1DE"]}
              onRefresh={() => this.receiveGlobalLeaderboards()}
            />
          }
          style={styles.leaderboards}>
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
