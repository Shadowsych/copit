// record packages
var AccountRecord = require("../records/AccountRecord");
var MarkerRecord = require("../records/MarkerRecord");

// utils packages
var UploadUtils = require("../utils/UploadUtils");

class MarkerListener {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("receiveMarkers", (data) => {this.receiveMarkers(data)});
    socket.on("receiveMyMarkers", (data) => {this.receiveMyMarkers(data)});
    socket.on("searchMarkers", (data) => {this.searchMarkers(data)});
    socket.on("addMarker", (data) => {this.addMarker(data)});
    socket.on("editMarker", (data) => {this.editMarker(data)});
    socket.on("deleteMarker", (data) => {this.deleteMarker(data)});
    socket.on("addLike", (data) => {this.addLike(data)});
  }

  // receive markers from the database, then send them to the client
  async receiveMarkers(data) {
    // interpret the variables passed from the client
    let longitude = data.message.longitude;
    let latitude = data.message.latitude;

    // create a prepared statement to receive the nearest markers
    const milesConstant = 3959;
    const mileRadius = 25;
    const nearestMarkers = 20;
    let query = "SELECT *, ("
      + `${milesConstant} * acos(cos(radians(?)) * cos(radians(latitude)) * `
      + "cos(radians(longitude) -radians(?)) + sin(radians(?)) * sin(radians(latitude)))"
      + ") AS distance FROM MarkerRecord WHERE expires > UNIX_TIMESTAMP(NOW(3)) * 1000 "
      + `HAVING distance < ${mileRadius} ORDER BY distance LIMIT 0, ${nearestMarkers}`;

    // query the database to receive the markers
    this.dbConn.query(query, [latitude, longitude, latitude], (error, result) => {
      if(!error) {
        // emit a message with the nearest markers to the client
        this.socket.emit("receiveMarkers", {
          success: true,
          message: JSON.stringify(result)
        });
      } else {
        // emit a message of failure to the client
        console.log(error);
        this.socket.emit("receiveMarkers", {
          success: false,
          message: "Error querying into the Database to receive markers..."
        });
      }
    });
  }

  // receive markers of the account, then send them back to the client
  async receiveMyMarkers(data) {
    // interpret the variables passed from the client
    let authorId = data.message.authorId;
    let authorToken = data.message.authorToken;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("receiveMyMarkers", {
        success: false,
        message: errorMessage
      });
    }

    // verify the author id and token are valid
    await AccountRecord.isAccountIdValid(this.dbConn, authorId, authorToken).then((valid) => {
      if(valid) {
        // create a prepared statement to receive the account's markers
        let query = "SELECT * FROM MarkerRecord WHERE "
          + " expires > UNIX_TIMESTAMP(NOW(3)) * 1000 AND author_id=?";

        // query the database to receive the markers
        this.dbConn.query(query, [authorId], (error, result) => {
          if(!error) {
            // emit a message with the markers of the account
            this.socket.emit("receiveMyMarkers", {
              success: true,
              message: JSON.stringify(result)
            });
          } else {
            failure(error, "Error querying into the Database to receive markers...");
          }
        });
      }
    }).catch((error) => {
      failure(error, "Error querying into the Database to verify account...");
    });
  }

  // search markers from the databse, then send them to the client
  async searchMarkers(data) {
    // interpret the variables passed from the client
    let longitude = data.message.longitude;
    let latitude = data.message.latitude;
    let search = data.message.search;
    let category = data.message.category;
    if(category == "All Categories") {
      // set the category wildcard as blank
      category = "";
    }

    // create a prepared statement to receive the nearest and searched markers
    const milesConstant = 3959;
    const mileRadius = 25;
    const nearestMarkers = 20;
    let query = "SELECT *, ("
      + `${milesConstant} * acos(cos(radians(?)) * cos(radians(latitude)) * `
      + "cos(radians(longitude) -radians(?)) + sin(radians(?)) * sin(radians(latitude)))"
      + `) AS distance FROM MarkerRecord WHERE (title LIKE '%${search}%' OR `
      + `description LIKE '%${search}%') AND category LIKE '%${category}%' `
      + `AND expires > UNIX_TIMESTAMP(NOW(3)) * 1000 HAVING distance < ${mileRadius} `
      + `ORDER BY distance LIMIT 0, ${nearestMarkers}`;

    // query the database to search the markers
    this.dbConn.query(query, [latitude, longitude, latitude], (error, result) => {
      if(!error) {
        // emit a message with the nearest markers to the client
        this.socket.emit("searchMarkers", {
          success: true,
          message: JSON.stringify(result)
        });
      } else {
        // emit a message of failure to the client
        console.log(error);
        this.socket.emit("searchMarkers", {
          success: false,
          message: "Error querying into the Database to search markers..."
        });
      }
    });
  }

  // add a marker
  async addMarker(data) {
    // interpret the variables passed from the client
    let authorId = data.message.author_id;
    let authorToken = data.message.author_token;
    let author = data.message.author;
    let title = data.message.title;
    let description = data.message.description;
    let longitude = data.message.longitude;
    let latitude = data.message.latitude;
    let picture = await UploadUtils.uploadBase64(
      data.message.picture_base64, "/media/ping_photos/");
    let category = data.message.category;
    let createdDate = this.getFutureTimeStamp(0, 0, 0, 0, 0, 0);

    // this marker expires after the given hours
    const hoursTillExpires = 4;
    let expires = this.getFutureTimeStamp(0, 0, 0, hoursTillExpires, 0, 0);

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("addMarker", {
        success: false,
        message: errorMessage
      });
    }

    // verify the author id and token are valid
    await AccountRecord.isAccountIdValid(this.dbConn, authorId, authorToken).then((valid) => {
      if(valid) {
        // create a prepared statement to insert this marker
        let query = "INSERT INTO MarkerRecord (author_id, author, title, description,"
          + " longitude, latitude, picture, category, created_date, expires) VALUES"
          + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // query to insert into the record
        this.dbConn.query(query, [authorId, author, title, description, longitude,
          latitude, picture, category, createdDate, expires], (error, result) => {
          if(!error) {
            // emit a message of success to the client
            console.log("Inserted 1 row into MarkerRecord: " + title);
            this.socket.emit("addMarker", {
              success: true,
              message: "Successfully added the ping!"
            });
          } else {
            failure(error, "Error querying into the Database to add ping...");
          }
        });
      } else {
        failure("Invalid Token: " + token, "The account id and token are invalid...");
      }
    }).catch((error) => {
      failure(error, "Error querying into the Database to verify account...");
    });
  }

  // edit a marker
  async editMarker(data) {
    // interpret the variables passed from the client
    let authorId = data.message.author_id;
    let authorToken = data.message.author_token;
    let markerId = data.message.marker_id;
    let author = data.message.author;
    let title = data.message.title;
    let description = data.message.description;
    let picture = data.message.picture_base64;
    if(picture) {
      // upload the new picture
      picture = await UploadUtils.uploadBase64(
        data.message.picture_base64, "/media/ping_photos/");
    }

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("addMarker", {
        success: false,
        message: errorMessage
      });
    }

    // call the verify id and get marker query promises
    let isAccountIdValid = AccountRecord.isAccountIdValid(this.dbConn, authorId, authorToken);
    let getMarker = MarkerRecord.getMarker(this.dbConn, markerId);
    await Promise.all([isAccountIdValid, getMarker]).then((resolved) => {
      // reference the resolved Array into variables
      let isValid = resolved[0];
      let marker = resolved[1];

      if(isValid && marker.author_id == authorId) {
        // set the new ping photo if it exists
        let newPicture = picture;
        if(newPicture && marker.picture) {
          // receive the file of the old ping photo
          let fileIndex = marker.picture.lastIndexOf("/") + 1;
          let oldFile = marker.picture.substring(fileIndex, marker.picture.length);

          // delete the old ping photo's file
          UploadUtils.deleteFile("/media/ping_photos/", oldFile);
        } else if(marker.picture) {
          newPicture = marker.picture;
        }

        // create a prepared statement to update the marker information
        let query = "UPDATE MarkerRecord SET author=?, title=?, "
          + "description=?, picture=? WHERE id=?";

        // query the database to update the mEKWE information
        this.dbConn.query(query,
          [author, title, description, newPicture, markerId], (error, result) => {
            if(!error) {
              // emit a message of success to the client
              console.log("Edited 1 marker from MarkerRecord: " + title);
              socket.emit("editMarker", {
                success: true,
                message: "Successfully updated the marker!"
              });
            } else {
              failure(error, "A query error occurred when editing the marker...");
            }}
        );
      } else {
        failure("Invalid Token: " + authorToken, "The account id and token are invalid...");
      }
    }).catch((error) => {
      failure(error, "A query error occurred when editing the ping...");
    });
  }

  // delete a marker
  async deleteMarker(data) {
    // interpret the variables passed from the client
    let authorId = data.message.author_id;
    let authorToken = data.message.author_token;
    let markerId = data.message.marker_id;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("deleteMarker", {
        success: false,
        message: errorMessage
      });
    }

    // call the verify id and get marker query promises
    let dbConn = this.dbConn;
    let isAccountIdValid = AccountRecord.isAccountIdValid(dbConn, authorId, authorToken);
    let getMarker = MarkerRecord.getMarker(dbConn, markerId);
    await Promise.all([isAccountIdValid, getMarker]).then((resolved) => {
      // reference the resolved Array into variables
      let isValid = resolved[0];
      let marker = resolved[1];

      if(isValid && marker.author_id == authorId) {
        // receive the file of the ping photo
        let fileIndex = marker.picture.lastIndexOf("/") + 1;
        let file = marker.picture.substring(fileIndex, marker.picture.length);

        // delete the ping photo's file
        UploadUtils.deleteFile("/media/ping_photos/", file);

        // delete the marker from the database
        MarkerRecord.deleteMarker(dbConn, markerId).then((deleted) => {
          if(deleted) {
            // emit a message of success to the client
            console.log("Deleted markerId: " + markerId);
            socket.emit("deleteMarker", {
              success: true,
              message: "Successfully deleted the marker!"
            });
          } else {
            failure("Delete Error for Marker ID: " + markerId, "Error deleting the marker!");
          }
        }).catch((error) => {
          failure(error, "Error querying into the database to delete the marker!");
        });
      } else {
        failure("Invalid Token: " + authorToken, "The account id and token are invalid...");
      }
    }).catch((error) => {
      failure(error, "A query error occurred when deleting the ping...");
    });
  }

  // add a like for a marker
  async addLike(data) {
    // interpret the variables passed from the client
    let userId = data.message.user_id;
    let userToken = data.message.user_token;
    let markerId = data.message.marker_id;

    // called whenever there exists a failure
    let socket = this.socket;
    function failure(error, errorMessage) {
      // emit a failed attempt to the client
      console.log(error);
      socket.emit("addLike", {
        success: false,
        message: errorMessage
      });
    }

    // verify the user id and token are valid
    let dbConn = this.dbConn;
    await AccountRecord.isAccountIdValid(dbConn, userId, userToken).then((valid) => {
      if(valid) {
        // add a like from the user for the marker
        MarkerRecord.addLike(dbConn, userId, markerId).then((result) => {
          if(result.success) {
            // emit a message of success to the client
            console.log("Added a like for markerId: " + markerId);
            socket.emit("addLike", {
              success: true,
              message: "Successfully added the like!"
            });

            // increase the author's points
            const authorId = result.authorId;
            const points = 1;
            AccountRecord.addPoints(dbConn, authorId, points).then((added) => {
              console.log("Added " + points + " points to account id " + authorId);
            }).catch((error) => {
              console.log(error);
            });
          } else {
            failure("Like Error for Marker ID: " + markerId, "Error adding like for the marker!");
          }
        }).catch((error) => {
          failure(error, "Error querying into the database to add the like!");
        });
      }
    }).catch((error) => {
      failure(error, "Error querying into the Database to verify account...");
    });
  }

  // return a future time stamp in UTC based on the current time
  getFutureTimeStamp(years, months, days, hours, minutes, seconds) {
    var today = new Date();

    // increase the date from today, then return the future timestamp as UTC
    today.setUTCFullYear(today.getUTCFullYear() + years);
    today.setUTCMonth(today.getUTCMonth() + months);
    today.setUTCDate(today.getUTCDate() + days);
    today.setUTCHours(today.getUTCHours() + hours);
    today.setUTCMinutes(today.getUTCMinutes() + minutes);
    today.setUTCSeconds(today.getUTCSeconds() + seconds);
    return today.getTime();
  }
}
module.exports = MarkerListener;
