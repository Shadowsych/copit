class SerialRecord {
  // return a promise to register a serial key into the database
  static async registerSerial(dbConn, email, expires) {
    return new Promise((resolve, reject) => {
      // minimum and maximum values for a serial key
      const minimum = 100000;
      const maximum = 900000;

      // create the serial key
      let serial = Math.floor(minimum + Math.random() * maximum);

      // create a prepared statement to insert or update serial keys
      let query = "REPLACE INTO SerialRecord (email, serial, expires) VALUES (?, ?, ?)";

      // query the database to register the serial key
      dbConn.query(query, [email, serial, expires], (error, result) => {
        if(!error) {
          // successfully inserted the serial key into the database
          resolve(serial);
        }
        reject(error);
      });
    });
  }

  // return a promise to get a serial key for an email
  static async getSerial(dbConn, email, serial) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to get a serial key from the email
      let query = "SELECT serial FROM SerialRecord WHERE email=?";

      // query the database to find the email's serial key
      dbConn.query(query, [email], (error, result) => {
        if(!error) {
          // receive the serial key
          resolve(result[0].serial);
        }
        reject(error);
      });
    });
  }
}
module.exports = SerialRecord;
