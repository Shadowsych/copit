class MarkerRecord {
  // return a promise to like a marker
  static async addLike(dbConn, userId, markerId) {
    // return an Array of likes with the user's id
    function addUserLike(userId, likes) {
      if(!likes) {
        // likes is null, initialize it with this user as the first like
        likes = [userId];
      } else if(!likes.includes(userId)) {
        // the user has not liked this marker, add the user's like
        likes.push(userId);
      }
      return likes;
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
          likes = addUserLike(userId, likes);

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
          reject(error);
        }
      });
    });
  }
}
module.exports = MarkerRecord;
