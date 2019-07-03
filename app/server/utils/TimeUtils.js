class TimeUtils {
  // return the points cost for creating a ping with a given time in minutes
  static getPingTimeCost(time) {
    // amnesty time in minutes to not incur a cost for a ping
    const amnestyTime = 120;

    // the increment of time in minutes multiplied by the cost rate
    const timeIncrement = 30;

    // the rate at which to increase the points cost per points increment
    const costRate = 1;

    // determine the cost in points for the time in minutes
    let pointsCost = 0;
    if(time > amnestyTime) {
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
