// react packages
import React from "react";

// styling packages
import {StyleSheet, SafeAreaView, Image, Text, View} from "react-native";
import NumericInput from "react-native-numeric-input";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  navbar: {
    flex: 0.10
  },
  title: {
    color: "#909090",
    fontSize: 18,
    fontFamily: "ubuntu-regular"
  }
});

// amnesty time in minutes to not incur a cost for a ping
const amnestyTime = 120;

// the increment of time in minutes multiplied by the cost rate
const timeIncrement = 30;

// the rate at which to increase the points cost per points increment
const costRate = 1;

class PingTimer extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      points: "...",
      time: this.props.time
    }
  }

  // called whenever the component loads
  componentDidMount() {
    this.receivePoints();
  }

  // receive the points of this account
  async receivePoints() {
    let socket = this.props.socket;

    // send an emit to receive the points
    this.setState({loading: true});
    socket.emit("receivePoints", {
      message: {
        id: this.props.id,
        token: this.props.token
      },
      handle: "handleReceivePoints"
    });

    // listen for the edit account response from the server
    socket.on("receivePoints", (data) => {
      this.setState({loading: false});
      if(data.success) {
        // set the points state
        this.setState({points: data.message.points});
      }
      socket.off("receivePoints");
    });
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.title}>Ping Expiration Time</Text>
        </View>
        <NumericInput
          value={this.state.time}
          rounded
          editable={false}
          minValue={timeIncrement}
          step={timeIncrement}
          onChange={(time) => this.changeTime(time)} />
      </SafeAreaView>
    );
  }

  // change the time
  changeTime(time) {
    // set the components' states
    this.setState({time: time});
    this.props.setTime(time);
  }
}
export default PingTimer;
