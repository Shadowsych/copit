// config packages
var guestConfig = require("../../../config/accounts/guest.json");

class AccountRecord {
  // return a promise to receive account data using an account token
  static async getAccount(dbConn, token) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "SELECT * FROM AccountRecord WHERE token=?";

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

  // return a promise to receive account data using an email
  static async getEmailAccount(dbConn, email) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "SELECT * FROM AccountRecord WHERE email=?";

      // query the database to receive the account information
      dbConn.query(query, [email], (error, result) => {
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
      if(id == guestConfig.id && token == guestConfig.token) {
        resolve(true);
      }

      // create a prepared statement to select from the account record
      let query = "SELECT * FROM AccountRecord WHERE id=? AND token=?";

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
      let query = "SELECT email FROM AccountRecord WHERE email=?";

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

  // return a promise to get points of an account id
  static async getPoints(dbConn, id) {
    return new Promise((resolve, reject) => {
      // guests have no points
      if(id == guestConfig.id) {
        resolve(0);
      }

      // create a prepared statement to select from the account record
      let query = "SELECT points FROM AccountRecord WHERE id=?";

      // query the database to receive the points of an account
      dbConn.query(query, [id], (error, result) => {
        if(!error) {
          result = JSON.parse(JSON.stringify(result));
          if(result.length != 0) {
            // received the points
            let points = result[0].points;
            resolve(points);
          }
          reject("Error no such Account ID exists!");
        }
        reject(error);
      });
    });
  }

  // return a promise to add points to an account id
  static async addPoints(dbConn, id, points) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "UPDATE AccountRecord SET points = points + ? WHERE id=?";

      // query the database to increase the points of an account
      dbConn.query(query, [points, id], (error, result) => {
        if(!error) {
          // increased the points
          resolve(true);
        }
        reject(error);
      });
    });
  }

  // return a promise to remove points from an account id
  static async removePoints(dbConn, id, points) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the account record
      let query = "UPDATE AccountRecord SET points = points - ? WHERE id=?";

      // query the database to decrease the points of an account
      dbConn.query(query, [points, id], (error, result) => {
        if(!error) {
          // increased the points
          resolve(true);
        }
        reject(error);
      });
    });
  }
}
module.exports = AccountRecord;
