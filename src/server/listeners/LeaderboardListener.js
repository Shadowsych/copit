class LeaderboardListener {
  // construct the record using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("receiveGlobalLeaderboards", (data) => {this.loadAccount(data)});
  }
}
module.exports = LeaderboardListener;
