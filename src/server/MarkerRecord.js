// file system packages
var fs = require("fs");

class MasterRecord {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("receiveMarkers", (data) => {this.receiveMarkers(data)});
    socket.on("addMarker", (data) => {this.addMarker(data)});
  }

  // receive then send markers to the client
  async receiveMarkers(data) {
    console.log(data);
  }

  // add marker
  async addMarker(data) {
    // interpret the variables passed from the client
    let title = data.message.title;
    let description = data.message.description;
    let longitude = data.message.longitude;
    let latitude = data.message.latitude;
    let picture = await this.uploadBase64(data.message.picture_base64, longitude, latitude);
    let category = data.message.category;
    let createdDate = this.getFutureTimeStamp(0, 0, 0, 0, 0, 0);

    // this marker expires after the given hours
    const hoursTillExpires = 4;
    let expires = this.getFutureTimeStamp(0, 0, 0, hoursTillExpires, 0, 0);

    // create a query to insert this marker
    let query = `INSERT INTO MarkerRecord (title, description, longitude, `
      + `latitude, picture, category, created_date, expires) VALUES`
      + `('${title}', '${description}', '${longitude}', '${latitude}', `
      + `'${picture}', '${category}', '${createdDate}', '${expires}')`;

    // query to insert into the record
    this.dbConn.query(query, (error, result) => {
      if(!error) {
        // emit a message of success to the client
        console.log("Inserted 1 row into MarkerRecord: " + title);
        this.socket.emit("addMarker", {
          success: true,
          message: "Successfully added the ping!"
        });
      } else {
        // emit a message of failure to the client
        this.socket.emit("addMarker", {
          success: false,
          message: "Error querying into the Database..."
        });
      }
    });
  }

  // upload the base64 picture, then return its directory
  async uploadBase64(base64, longitude, latitude) {
    if(base64) {
      let uniqueId = longitude + "_" + latitude;
      if (!fs.existsSync(__dirname + "/media")
        || !fs.existsSync(__dirname + "/media/pings")
        || !fs.existsSync(__dirname + "/media/pings/" + uniqueId)) {
          // create the missing directories
          fs.mkdirSync(__dirname + "/media");
          fs.mkdirSync(__dirname + "/media/pings");
          fs.mkdirSync(__dirname + "/media/pings/" + uniqueId);
      }
      let directory = __dirname + "/media/pings/" + uniqueId + "/picture.png";

      // upload the base64 picture
      fs.writeFile(directory, base64, {encoding: "base64"}, (error) => {
        if(error) {
          console.log(error);
        }
      });
      return "192.168.0.18:3000/media/pings/" + uniqueId + "/picture.png";
    }
    return undefined;
  }

  // return a future time stamp from the current time
  getFutureTimeStamp(yearIncrease, monthIncrease, dayIncrease,
      hourIncrease, minuteIncrease, secondIncrease) {
    var today = new Date();

    // get the modified date
    var date = (today.getFullYear() + yearIncrease) + "-"
      + (today.getMonth() + 1 + monthIncrease) + "-"
      + (today.getDate() + dayIncrease);

    // get the modified time
    var time = (today.getHours() + hourIncrease) + ":"
      + (today.getMinutes() + minuteIncrease) + ":"
      + (today.getSeconds() + secondIncrease);

    // concatenate the date and time, then return it
    var dateTime = date + " " + time;
    return dateTime;
  }
}
module.exports = MasterRecord;
