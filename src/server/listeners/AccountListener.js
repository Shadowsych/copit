// token creation packages
var uuidv4 = require("uuid/v4");

// record packages
var AccountRecord = require("../records/AccountRecord");

// utils packages
var UploadUtils = require("../utils/UploadUtils");

class AccountListener {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("loadAccount", (data) => {this.loadAccount(data)});
    socket.on("loginAccount", (data) => {this.loginAccount(data)});
    socket.on("registerAccount", (data) => {this.registerAccount(data)});
    socket.on("editAccount", (data) => {this.editAccount(data)});
  }

  // load an account
  async loadAccount(data) {
    let token = data.message.token;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("loadAccount", {
        success: false,
        message: errorMessage
      });
    }

    // get the account using the provided token
    AccountRecord.getAccount(this.dbConn, token).then((account) => {
      if(account) {
        // emit success to the client
        console.log("Token " + token + " logged in!");
        socket.emit("loadAccount", {
          success: true,
          message: account
        });
      } else {
        failure("Account Token Invalid! " + token, "The account token is invalid!");
      }
    }).catch((error) => {
      failure(error, "An error occurred receiving the account information!")
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
          console.log(email + " logged in!");
          socket.emit("loginAccount", {
            success: true,
            message: accountData[0]
          });
        } else {
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
      data.message.profile_photo_base64, "/media/profile_photos/");

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

    if(this.isFieldsValid(name, email, password)) {
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

  // edit an account
  async editAccount(data) {
    // interpret the variables passed from the client
    let token = data.message.token;
    let name = data.message.name;
    let email = data.message.email;
    let password = data.message.password;
    let profilePhoto = data.message.profile_photo_base64;
    if(profilePhoto) {
      // upload the new profile photo
      profilePhoto = await UploadUtils.uploadBase64(
        data.message.profile_photo_base64, "/media/profile_photos/");
    }

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("editAccount", {
        success: false,
        message: errorMessage
      });
    }

    // call the get account and email query promises
    let getAccount = AccountRecord.getAccount(this.dbConn, token);
    let isEmailExists = AccountRecord.isEmailExists(this.dbConn, email);
    await Promise.all([getAccount, isEmailExists]).then((resolved) => {
      // reference the resolved Array into variables
      let accountData = resolved[0];
      let emailExists = resolved[1];

      // check if the new email is valid
      if(!emailExists || email == accountData.email) {
        // set the password variable if it exists
        let newPassword = password ? password : accountData.password;

        // check if the new fields are valid
        if(this.isFieldsValid(name, email, newPassword)) {
          // set the new profile photo if it exists
          let newProfilePhoto = profilePhoto;
          if(newProfilePhoto) {
            // receive the folder of the old profile photo
            let oldFolderName = accountData.profile_photo.substring(
              accountData.profile_photo.indexOf("/profile_photos/") + 1,
              accountData.profile_photo.indexOf("/picture.png")
            ).replace("profile_photos/", "");

            // delete the old profile photo's directory
            UploadUtils.deleteDirectory("../media/profile_photos/" + oldFolderName);
          } else {
            newProfilePhoto = accountData.profile_photo;
          }

          // create a prepared statement to insert the account information
          let query = "UPDATE AccountRecord SET name=?, email=?, "
            + "password=?, profile_photo=? WHERE id=?";

          // query the database to update the account information
          this.dbConn.query(query,
            [name, email, newPassword, newProfilePhoto, accountData.id], (error, result) => {
              if(!error) {
                // emit a message of success to the client
                console.log("Edited 1 account from AccountRecord: " + email);
                socket.emit("editAccount", {
                  success: true,
                  message: "Successfully updated the account!"
                });
              } else {
                failure(error, "A query error occurred when editing the account...");
              }}
          );
        } else {
          failure("The fields are invalid!", "Invalid fields were used when editing!");
        }
      } else {
        failure("This email is already used!", "This email is already used!");
      }
    }).catch((error) => {
      failure(error, "A query error occurred when editing the account...");
    });
  }

  // return if the account fields are valid
  isFieldsValid(name, email, password) {
    return !(name == "" || email == "" || password == "" || !this.isEmailValid(email));
  }

  // return if an email is valid
  isEmailValid(email) {
    let emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
}
module.exports = AccountListener;
