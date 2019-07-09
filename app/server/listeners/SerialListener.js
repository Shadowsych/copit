// record packages
var AccountRecord = require("../records/AccountRecord");
var SerialRecord = require("../records/SerialRecord");

class SerialListener {
  // construct the listener using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("useSerialKey", (data) => {this.useSerialKey(data)});
  }

  // use a serial key
  async useSerialKey(data) {
    // interpret the variables passed from the client
    let email = data.message.email;
    let serial = data.message.serial;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("useSerialKey", {
        success: false,
        message: errorMessage
      });
    }

    // call the get serial and get email token promises
    let getSerial = SerialRecord.getSerial(this.dbConn, email);
    let getEmailAccount = AccountRecord.getEmailAccount(this.dbConn, email);
    await Promise.all([getSerial, getEmailAccount]).then((resolved) => {
      // reference the resolved Array into variables
      let serialValid = serial == resolved[0];
      let account = resolved[1];

      if(serialValid && account) {
        // emit a message of success to the client
        console.log("Logged in " + email + " using serial key " + serial);
        socket.emit("useSerialKey", {
          success: true,
          message: account
        });
      } else {
        failure("Invalid Serial Key: " + serial, "The serial key is invalid for the email!");
      }
    }).catch((error) => {
      failure(error, "Error: A query error occurred when using the serial key!");
    });
  }
}
module.exports = SerialListener;
