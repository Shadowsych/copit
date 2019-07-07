// react packages
import {Notifications} from "expo";
import * as Permissions from "expo-permissions";

class NotificationUtils {

  // present a local notification
  static async presentLocalNotification(title, text) {
    let {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if(status == "granted") {
      // create a local notification
      let localNotification = {
        title: title,
        body: text
      };

      // notify the user of the notification
      Notifications.presentLocalNotificationAsync(localNotification);
    }
  }

  // schedule a local notification
  static async scheduleLocalNotification(title, text, minutes, repeat) {
    let {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if(status == "granted") {
      // cancel all previously scheduled notifications
      Notifications.cancelAllScheduledNotificationsAsync();

      // create a local notification
      let localNotification = {
        title: title,
        body: text
      };

      // create a scheduler
      const mToMs = 60000;
      const timeInMs = minutes * mToMs;
      let schedulingOptions = {
        time: (new Date().getTime()) + timeInMs,
        repeat: repeat
      }

      // notify the user of the notification after the schedule
      Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
    }
  }
}
export default NotificationUtils;
