// file system packages
var fs = require("fs");
var uniqid = require('uniqid');
var config = require("../../server.json");

// record classes
let AccountRecord = require("./AccountRecord");

class MasterRecord {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("receiveMarkers", (data) => {this.receiveMarkers(data)});
    socket.on("searchMarkers", (data) => {this.searchMarkers(data)});
    socket.on("addMarker", (data) => {this.addMarker(data)});
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
    let query = "SELECT id, author, title, description, longitude, latitude, "
      + "picture, category, likes, created_date, expires, ("
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
    let query = "SELECT id, author, title, description, longitude, latitude, "
      + "picture, category, likes, created_date, expires, ("
      + `${milesConstant} * acos(cos(radians(?)) * cos(radians(latitude)) * `
      + "cos(radians(longitude) -radians(?)) + sin(radians(?)) * sin(radians(latitude)))"
      + `) AS distance FROM MarkerRecord WHERE `
      + `description LIKE '%${search}%' AND category LIKE '%${category}%' `
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
    let picture = await this.uploadBase64(data.message.picture_base64);
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
        failure("Invalid Token: " + token, "The account id and token is invalid...");
      }
    }).catch((error) => {
      failure(error, "Error querying into the Database to verify account...");
    });
  }

  // add a like for a marker
  async addLike(data) {
    // interpret the variables passed from the client
    let userId = data.message.user_id;
    let userToken = data.message.user_token;
    let markerId = data.message.marker_id;

    // verify the user id and token are valid
    await AccountRecord.isAccountIdValid(this.dbConn, userId, userToken).then((valid) => {
      if(valid) {
        // create a prepared statement to receive the liked marker
        let query = "SELECT likes FROM MarkerRecord WHERE id=?";

        // query the database to find the liked marker
        this.dbConn.query(query, [markerId], (error, result) => {
          if(!error) {
            // update the likes Array
            let likes = JSON.parse(JSON.parse(JSON.stringify(result))[0].likes);
            this.updateLikes(userId, markerId, likes);
          } else {
            console.log(error);
          }
        });
      }
    });
  }

  // update a like for a marker
  async updateLikes(userId, markerId, likes) {
    let alreadyAddedLike = false;
    if(!likes) {
      // likes is null, initialize it with this user as the first like
      likes = [userId];
    } else if(!likes.includes(userId)) {
      // add the user's like
      likes.push(userId);
    } else {
      alreadyAddedLike = true;
    }
    if(!alreadyAddedLike) {
      // created a prepared statement to update the liked marker
      let query = "UPDATE MarkerRecord SET likes=? WHERE id=?";

      // query the database to add the liked marker
      likes = JSON.stringify(likes);
      this.dbConn.query(query, [likes, markerId], (error, result) => {
        if(!error) {
          console.log("Added a like for markerId: " + markerId);
        } else {
          console.log(error);
        }
      });
    }
  }

  // upload the base64 picture, then return its directory
  async uploadBase64(base64) {
    if(base64) {
      // create the directories if they do not exist
      let uniqueId = uniqid();
      if (!fs.existsSync(__dirname + "/media")) {
        fs.mkdirSync(__dirname + "/media");
      }
      if(!fs.existsSync(__dirname + "/media/pings")) {
        fs.mkdirSync(__dirname + "/media/pings");
      }
      if(!fs.existsSync(__dirname + "/media/pings/" + uniqueId)) {
        fs.mkdirSync(__dirname + "/media/pings/" + uniqueId);
      }
      let directory = __dirname + "/media/pings/" + uniqueId + "/picture.png";

      // upload the base64 picture
      fs.writeFile(directory, base64, {encoding: "base64"}, (error) => {
        if(error) {
          console.log(error);
        }
      });
      // return the URL of the uploaded image
      return config.serverDomain + ":" + config.serverPort
        + "/media/pings/" + uniqueId + "/picture.png";
    }
    return undefined;
  }

  // return a future time stamp from the current time
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
module.exports = MasterRecord;
