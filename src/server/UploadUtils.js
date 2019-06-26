// file system packages
var fs = require("fs");
var mkdirp = require('mkdirp');
var uniqid = require('uniqid');
var config = require("../../server.json");

class UploadUtils {
  // upload a base64 picture, then return its directory
  static async uploadBase64(base64, directory, file) {
    if(base64) {
      // create the directories if they do not exist
      let uniqueId = uniqid();
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
    return undefined;
  }
}
module.exports = UploadUtils;
