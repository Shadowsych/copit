// file system packages
var fs = require("fs");
var uniqid = require('uniqid');
var config = require("../../server.json");

class AccountRecord {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("registerAccount", (data) => {this.registerAccount(data)});
    socket.on("loginAccount", (data) => {this.loginAccount(data)});
  }

  // register an account
  async registerAccount(data) {
    // interpret the variables passed from the client
    let email = data.message.email;
    let password = data.message.password;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("registerAccount", {
        success: false,
        message: errorMessage
      });
    }

    // call the email query promise
    await AccountRecord.isEmailExists(this.dbConn, email).then((exists) => {
      if(!exists) {
        // generate a random token
        let token = uniqid();

        // create a prepared statement to insert the account information
        let query = "INSERT INTO AccountRecord (token, email, password) "
          + "VALUES (?, ?, ?)";

        // query the database to insert the account information
        this.dbConn.query(query, [token, email, password], (error, result) => {
          if(!error) {
            // emit a message of success to the client
            console.log("Registered 1 account into AccountRecord: " + token);
            socket.emit("registerAccount", {
              success: true,
              message: {
                id: result.insertId,
              }
            });
          } else {
            failure(error, "A query error occurred when registering for the account...");
          }
        });
      } else {
        failure("This email is already registered!", "This email is already registered!");
      }
    }).catch((error) => {
      failure(error, "A query error occurred when registering the account...");
    });
  }

  // login an account
  async loginAccount(data) {
    // interpret the variables passed from the client
    let email = data.message.email;
    let password = data.message.password;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("loginAccount", {
        success: false,
        message: errorMessage
      });
    }

    // create a prepared statement to select from the account record
    let query = "SELECT * FROM AccountRecord WHERE email=? AND password=?";

    // query the database to receive the account information
    this.dbConn.query(query, [email, password], (error, result) => {
      if(!error) {
        let accountData = JSON.parse(JSON.stringify(result));
        if(accountData.length != 0) {
          // emit the account data back to the client
          socket.emit("loginAccount", {
            success: true,
            message: accountData[0]
          });
        } else {
          // there was no such account
          failure("Login Failed for " + email + "!", "Invalid login credentials.");
        }
      } else {
        failure(error, "There was a query error when logging the account.");
      }
    });
  }

  // return a promise to receive account data using an account token
  static async getAccount(dbConn, token) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "SELECT * FROM AccountRecord WHERE token=?"

      // query the database to receive the account information
      dbConn.query(query, [token], (error, result) => {
        if(!error) {
          let accountData = JSON.parse(JSON.stringify(result));
          if(accountData.length != 0) {
            // found the account data
            resolve(accountData[0]);
          }
          // there was no such account
          resolve(undefined);
        }
        reject(error);
      });
    });
  }

  // return a promise to check if an email is within the record
  static async isEmailExists(dbConn, email) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "SELECT email FROM AccountRecord WHERE email=?"

      // query the database to insert the account information
      dbConn.query(query, [email], (error, result) => {
        if(!error) {
          if(result.length != 0) {
            // the email exists
            resolve(true);
          }
          // the email does not exist
          resolve(false);
        }
        reject(error);
      });
    });
  }
}
module.exports = AccountRecord;
