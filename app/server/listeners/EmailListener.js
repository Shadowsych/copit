class EmailListener {
  // construct the listener using the socket and database connections
  constructor(socket, dbConn) {
    this.socket = socket;
    this.dbConn = dbConn;

    // handle emissions from the client
    socket.on("emailForgotPassword", (data) => {this.emailForgotPassword(data)});
  }

  // send a forgot password email with a serial code to access the account
  async emailForgotPassword(data) {
    
  }
}
module.exports = EmailListener;
