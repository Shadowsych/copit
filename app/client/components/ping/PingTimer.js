// react packages
import React from "react";

// styling packages
import {StyleSheet, SafeAreaView, Image, Text, View} from "react-native";
import {Icon} from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import NumericInput from "react-native-numeric-input";

// config packages
import {amnestyTime, timeIncrement, costRate} from "../../../../config/shop/ping_timer.json";

// style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  navbar: {
    flex: 0.20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  title: {
    color: "#909090",
    fontSize: 18,
    fontFamily: "ubuntu-regular"
  },
  points_container: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5
  },
  points_text: {
    color: "#929497",
    fontSize: 16,
    fontFamily: "ubuntu-regular"
  },
  input_time_container: {
    flex: 0.80,
    justifyContent: "center",
    alignItems: "center"
  },
  time_text: {
    color: "#75B1DE"
  },
  change_value_text: {
    color: "#909090",
  },
  time_unit_text: {
    color: "#75B1DE",
    fontSize: 12
  },
  remaining_points_text: {
    marginTop: 10,
    color: "#909090",
    fontSize: 16
  }
});

class PingTimer extends React.Component {
  // construct the state of the component
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      points: this.props.points,
      remaining_points: this.props.points,
      time: this.props.time,
      max_time: 0
    }
  }

  // called whenever the component loads
  componentDidMount() {
    this.changeTime(this.props.time);
    this.setMaxTime(this.props.points);
  }

  // render the component's views
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} />
        <View style={styles.navbar}>
          <Text style={styles.title}>Ping Expiration Time</Text>
          <View style={styles.points_container}>
            <Icon name="medal" type="entypo" color="#75B1DE" size={22} />
            <Text style={styles.points_text}>{this.state.points}</Text>
          </View>
        </View>
        <View style={styles.input_time_container}>
          <NumericInput
            value={this.state.time}
            rounded
            editable={false}
            step={timeIncrement}
            minValue={timeIncrement}
            maxValue={this.state.max_time}
            totalWidth={200}
            inputStyle={styles.time_text}
            iconStyle={styles.change_value_text}
            onChange={(time) => this.changeTime(time)} />
            <Text style={styles.time_unit_text}>
              Minutes
            </Text>
          <Text style={styles.remaining_points_text}>
            Points Left: {this.state.remaining_points}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // calculate the remaining points and set its state
  calculateRemainingPoints(time) {
    // determine the cost in points for the time in minutes
    let pointsCost = 0;
    if(time > amnestyTime) {
      let costlyTime = (time - amnestyTime) / timeIncrement;
      pointsCost = Math.ceil(costlyTime * costRate);
    }

    // update the state of remaining points
    let remainingPoints = this.state.points - pointsCost;
    return remainingPoints;
  }

  // set the max time state that the account can use
  setMaxTime(points) {
    // the time available per point
    let timePerPoint = timeIncrement / costRate;

    // the exact time to use
    let exactMaxTime = amnestyTime + (points * timePerPoint);

    // now round to the floor multiple of time increment
    let maxTime = Math.floor(exactMaxTime / timeIncrement) * timeIncrement;

    // set the max time
    this.setState({max_time: maxTime});
  }

  // change the time
  changeTime(time) {
    // set the components' states
    this.setState({time: time});
    this.props.setTime(time);

    // update the remaining points
    let remainingPoints = this.calculateRemainingPoints(time);
    this.setState({remaining_points: remainingPoints});
  }
}
export default PingTimer;
