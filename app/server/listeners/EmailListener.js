// record packages
var AccountRecord = require("../records/AccountRecord");
var SerialRecord = require("../records/SerialRecord");

// utils packages
var EmailUtils = require("../utils/EmailUtils");
var TimeUtils = require("../utils/TimeUtils");

class EmailListener {
  // construct the listener using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("emailForgotPassword", (data) => {this.emailForgotPassword(data)});
  }

  // send a forgot password email with a serial key to access the account
  async emailForgotPassword(data) {
    // interpret the variables passed from the client
    let email = data.message.email;

    // the serial key expires after an hour
    let expires = TimeUtils.getFutureTimeStamp(0, 0, 0, 1, 0, 0);

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("emailForgotPassword", {
        success: false,
        message: errorMessage
      });
    }

    // call the email exists and register serial promises
    let isEmailExists = AccountRecord.isEmailExists(this.dbConn, email);
    let registerSerial = SerialRecord.registerSerial(this.dbConn, email, expires);
    await Promise.all([isEmailExists, registerSerial]).then((resolved) => {
      // reference the resolved Array into variables
      let emailExists = resolved[0];
      let serial = resolved[1];

      if(emailExists) {
        // emit a message of success back to the client
        console.log(`Sent an email to ${email} with a forgot password serial key!`);
        socket.emit("emailForgotPassword", {
          success: true,
          message: `Sent an email to ${email} with the serial key!`
        });


        // the email exists, so send an email with the serial key
        EmailUtils.sendEmail(email, "Forgot Password - Serial Key",
          `<h3>Enter this Serial Key to access your account: ${serial}</h3>`
          + `<p>The serial key will expire soon. If it expires, `
          + `then just re-send the forgot password email.</p>`
          + `<p>Once you're logged in after using the serial key, change `
          + `your password within the Account settings of the app.</p>`
        );
      } else {
        failure("Email does not exist: " + email,
          "The email is not registered in our records!");
      }
    }).catch((error) => {
      failure(error, "Error: A query error occurred when registering the serial key!");
    });
  }
}
module.exports = EmailListener;
