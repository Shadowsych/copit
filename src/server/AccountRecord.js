// token creation packages
var uuidv4 = require("uuid/v4");

// utils packages
var UploadUtils = require("./UploadUtils");

class AccountRecord {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("loginAccount", (data) => {this.loginAccount(data)});
    socket.on("registerAccount", (data) => {this.registerAccount(data)});
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
          console.log(email + " logged in!");
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

  // register an account
  async registerAccount(data) {
    // interpret the variables passed from the client
    let name = data.message.name;
    let email = data.message.email;
    let password = data.message.password;
    let profilePhoto = await UploadUtils.uploadBase64(
      data.message.profile_photo_base64, "/media/profile_photos", "picture.png"
    );

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

    if(this.isRegistrationValid(name, email, password)) {
      // call the email query promise
      await AccountRecord.isEmailExists(this.dbConn, email).then((exists) => {
        if(!exists) {
          // generate a random token
          let token = uuidv4();

          // create a prepared statement to insert the account information
          let query = "INSERT INTO AccountRecord (token, name, email, password, profile_photo) "
            + "VALUES (?, ?, ?, ?, ?)";

          // query the database to insert the account information
          this.dbConn.query(query,
            [token, name, email, password, profilePhoto], (error, result) => {
              if(!error) {
                // emit a message of success to the client
                console.log("Registered 1 account into AccountRecord: " + email);
                socket.emit("registerAccount", {
                  success: true,
                  message: {
                    id: result.insertId,
                    token: token,
                    name: name,
                    email: email,
                    points: 0,
                    profile_photo: profilePhoto
                  }
                });
              } else {
                failure(error, "A query error occurred when registering for the account...");
              }}
            );
        } else {
          failure("This email is already registered!", "This email is already registered!");
        }
      }).catch((error) => {
        failure(error, "A query error occurred when verifying the email...");
      });
    } else {
      failure("The fields are invalid!", "Invalid fields were used when registering!");
    }
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

  // return a promise to check if an account id is valid using an account token
  static async isAccountIdValid(dbConn, id, token) {
    return new Promise((resolve, reject) => {
      // guests have an imaginary id and token
      let guestIdToken = -1;
      if(id == guestIdToken && token == guestIdToken) {
        resolve(true);
      }

      // create a prepared statement to select from the account record
      let query = "SELECT * FROM AccountRecord WHERE id=? AND token=?"

      // query the database to receive the account information
      dbConn.query(query, [id, token], (error, result) => {
        if(!error) {
          let accountData = JSON.parse(JSON.stringify(result));
          if(accountData.length != 0) {
            // the account id is valid for the given token
            resolve(true);
          }
          // the account id is invalid for the given token
          resolve(false);
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

  // return if the registration fields are valid
  isRegistrationValid(name, email, password) {
    return !(name == "" || email == "" || password == "" || !this.isEmailValid(email));
  }

  // return if an email is valid
  isEmailValid(email) {
    let emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
}
module.exports = AccountRecord;
