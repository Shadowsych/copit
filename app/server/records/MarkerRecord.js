class MarkerRecord {
  // return a promise to receive marker data using a marker id
  static async getMarker(dbConn, id) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to select from the marker record
      let query = "SELECT * FROM MarkerRecord WHERE id=?";

      // query the database to receive the marker information
      dbConn.query(query, [id], (error, result) => {
        if(!error) {
          let markerData = JSON.parse(JSON.stringify(result));
          if(markerData.length != 0) {
            // found the marker data
            resolve(markerData[0]);
          }
          // there was no such marker
          resolve(undefined);
        }
        reject(error);
      });
    });
  }

  // return a promise to delete a marker using a marker id
  static async deleteMarker(dbConn, id) {
    return new Promise((resolve, reject) => {
      // create a prepared statement to delete from the marker record
      let query = "DELETE FROM MarkerRecord WHERE id=?";

      // query the database to delete from the marker record
      dbConn.query(query, [id], (error, result) => {
        if(!error) {
          resolve(true);
        }
        reject(error);
      });
    });
  }

  // return a promise to like a marker
  static async addLike(dbConn, userId, markerId) {
    // return an Array of likes with the user's id
    function addUserLike(userId, likes) {
      let alreadyLiked = false;
      if(!likes) {
        // likes is null, initialize it with this user as the first like
        likes = [userId];
      } else if(!likes.includes(userId)) {
        // the user has not liked this marker, add the user's like
        likes.push(userId);
      } else {
        // the user has already liked this marker
        alreadyLiked = true;
      }
      return {
        likes: likes,
        alreadyLiked: alreadyLiked
      };
    }

    return new Promise((resolve, reject) => {
      // create a prepared statement to receive the liked marker
      let query = "SELECT author_id, likes FROM MarkerRecord WHERE id=?";

      // query the database to find the liked marker
      dbConn.query(query, [markerId], (error, result) => {
        if(!error) {
          // update the likes Array
          let authorId = JSON.parse(JSON.stringify(result))[0].author_id;
          let likes = JSON.parse(JSON.parse(JSON.stringify(result))[0].likes);

          // update the like result once adding the user's like
          let likeResult = addUserLike(userId, likes);
          likes = likeResult.likes;
          let alreadyLiked = likeResult.alreadyLiked;
          
          if(!alreadyLiked) {
            // created a prepared statement to update the liked marker
            let query = "UPDATE MarkerRecord SET likes=? WHERE id=?";

            // query the database to update the liked Array for the marker
            likes = JSON.stringify(likes);
            dbConn.query(query, [likes, markerId], (error, result) => {
              if(!error) {
                // added the like successfully
                resolve({
                  success: true,
                  authorId: authorId
                });
              }
              reject(error);
            });
          } else {
            // the user already liked the marker
            resolve({
              success: false,
            });
          }
        } else {
          reject(error);
        }
      });
    });
  }
}
module.exports = MarkerRecord;
