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
      // create a query to delete any expired markers
      let query = "DELETE FROM MarkerRecord WHERE expires < UNIX_TIMESTAMP(NOW(3)) * 1000";

      // query the database to delete the markers
      this.dbConn.query(query, [], (error, result) => {
        if(!error) {
          // deleted the expired markers
          console.log("Successfully deleted expired markers!");
        } else {
          console.log(error);
        }
      });
    }, timeInMs);
  }

  // delete expired serial keys
  async deleteExpiredSerial(minutes) {
  }
}
module.exports = DeleteExpired;
