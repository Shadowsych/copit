// utils packages
var UploadUtils = require("../utils/UploadUtils");

// config packages
var deleteExpiredConfig = require("../../../config/crontabs/delete_expired.json");

class DeleteExpired {
  // construct the crontab using the database connection
  constructor(dbConn) {
    this.dbConn = dbConn;

    // call the delete expired intervals
    this.deleteExpiredMarkers(deleteExpiredConfig.markersInterval);
    this.deleteExpiredSerial(deleteExpiredConfig.serialInterval);
  }

  // delete expired markers
  async deleteExpiredMarkers(minutes) {
    const mToMs = 60000;
    let timeInMs = minutes * mToMs;

    // create an interval to delete the expired markers
    setInterval(() => {
      // create a multi-query to select and delete any expired markers
      let query = "SELECT picture FROM MarkerRecord WHERE expires < "
        + "UNIX_TIMESTAMP(NOW(3)) * 1000; DELETE FROM MarkerRecord "
        + "WHERE expires < UNIX_TIMESTAMP(NOW(3)) * 1000";

      // query the database to delete the markers
      this.dbConn.query(query, [], (error, result) => {
        if(!error) {
          // deleted the expired markers
          console.log("Successfully deleted expired markers!");

          // delete the picture of each expired marker
          let pictures = result[0];
          for(let pictureIndex = 0; pictureIndex < pictures.length; pictureIndex++) {
            // delete this marker's picture
            let picture = pictures[pictureIndex].picture;
            UploadUtils.deleteFileURL(picture, "/media/ping_photos/");
          }
        } else {
          console.log(error);
        }
      });
    }, timeInMs);
  }

  // delete expired serial keys
  async deleteExpiredSerial(minutes) {
    const mToMs = 60000;
    let timeInMs = minutes * mToMs;

    // create an interval to delete the expired serial keys
    setInterval(() => {
      // create a query delete any expired serial keys
      let query = "DELETE FROM SerialRecord WHERE expires < UNIX_TIMESTAMP(NOW(3)) * 1000";

      // query the database to delete the serial keys
      this.dbConn.query(query, [], (error, result) => {
        if(!error) {
          // deleted the expired serial keys
          console.log("Successfully deleted expired serial keys!");
        } else {
          console.log(error);
        }
      });
    }, timeInMs);
  }
}
module.exports = DeleteExpired;
