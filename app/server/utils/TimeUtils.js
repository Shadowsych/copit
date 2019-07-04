// config packages
var {amnestyTime, timeIncrement, costRate} = require("../../../config/shop/ping_timer.json");

class TimeUtils {
  // return the points cost for creating a ping with a given time in minutes
  static getPingTimeCost(time) {
    let pointsCost = 0;
    if(time > amnestyTime) {
      // determine the cost in points for the time in minutes
      let costlyTime = (time - amnestyTime) / timeIncrement;
      pointsCost = Math.ceil(costlyTime * costRate);
    }
    return pointsCost;
  }

  // return a future time stamp in UTC based on the current time
  static getFutureTimeStamp(years, months, days, hours, minutes, seconds) {
    var today = new Date();

    // increase the date from today, then return the future timestamp as UTC
    today.setUTCFullYear(today.getUTCFullYear() + years);
    today.setUTCMonth(today.getUTCMonth() + months);
    today.setUTCDate(today.getUTCDate() + days);
    today.setUTCHours(today.getUTCHours() + hours);
    today.setUTCMinutes(today.getUTCMinutes() + minutes);
    today.setUTCSeconds(today.getUTCSeconds() + seconds);
    return today.getTime();
  }
}
module.exports = TimeUtils;
