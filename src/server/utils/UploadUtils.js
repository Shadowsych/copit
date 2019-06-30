// file system packages
var fs = require("fs");
var rimraf = require("rimraf");
var uuidv4 = require("uuid/v4");
var config = require("../../../server.json");

class UploadUtils {
  // upload a base64 picture, then return its directory
  static async uploadBase64(base64, directory) {
    if(base64) {
      // receive a random token id, then use it as an image file name
      let file = uuidv4() + ".png";

      // upload the base64 picture
      let uploadDir = directory + file;
      fs.writeFile("." + uploadDir, base64, {encoding: "base64"}, (error) => {
        if(error) {
          console.log(error);
        }
      });
      // return the URL of the uploaded image
      return config.serverDomain + ":" + config.serverPort + uploadDir;
    }
    // return the default icon URL
    return config.serverDomain + ":" + config.serverPort + "/assets/icons/no_icon.png";
  }

  // delete a directory
  static async deleteDirectory(directory) {
    await rimraf(directory, () => {
      console.log("Deleted directory: " + directory);
    });
  }
}
module.exports = UploadUtils;
