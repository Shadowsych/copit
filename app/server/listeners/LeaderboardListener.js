class LeaderboardListener {
  // construct the listener using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("receiveGlobalLeaderboards", (data) => {this.receiveGlobalLeaderboards(data)});
  }

  // receive the global leaderboards, then send them to the client
  receiveGlobalLeaderboards(data) {
    // the number of users to receive
    const numberUsers = 10;

    // create a prepared statement to receive the users with the highest points
    let query = "SELECT name, profile_photo, points FROM AccountRecord "
      + `ORDER BY points DESC LIMIT ${numberUsers}`;

    // query the database to receive the users
    this.dbConn.query(query, [], (error, result) => {
      if(!error) {
        // emit a message with the nearest markers to the client
        this.socket.emit("receiveGlobalLeaderboards", {
          success: true,
          message: JSON.stringify(result)
        });
      } else {
        // emit a message of failure to the client
        console.log(error);
        this.socket.emit("receiveGlobalLeaderboards", {
          success: false,
          message: "Error querying into the Database to receive leaderboards..."
        });
      }
    });
  }
}
module.exports = LeaderboardListener;
