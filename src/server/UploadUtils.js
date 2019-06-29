// file system packages
var fs = require("fs");
var mkdirp = require("mkdirp");
var uuidv4 = require("uuid/v4");
var config = require("../../server.json");

class UploadUtils {
  // upload a base64 picture, then return its directory
  static async uploadBase64(base64, directory, file) {
    if(base64) {
      // create the directories if they do not exist
      let uniqueId = uuidv4();
      directory += "/" + uniqueId;
      await mkdirp(__dirname + directory, (error) => {
        if(!error) {
          // upload the base64 picture
          let pictureDir = __dirname + directory + "/" + file;
          fs.writeFile(pictureDir, base64, {encoding: "base64"}, (error) => {
            if(error) {
              console.log(error);
            }
          });
        } else {
          console.log(error);
        }
      });
      // return the URL of the uploaded image
      return config.serverDomain + ":" + config.serverPort + directory + "/" + file;
    }
    // return the default icon URL
    return config.serverDomain + ":" + config.serverPort + "/media/defaults/icons/no_icon.png";
  }
}
module.exports = UploadUtils;
