// server packages
var express = require("express");
var socket = require("socket.io");
var mysql = require('mysql');

// file system packages
var config = require("../../config/server.json");

// listener classes
var AccountListener = require("./listeners/AccountListener");
var MarkerListener = require("./listeners/MarkerListener");
var LeaderboardListener = require("./listeners/LeaderboardListener");

// initiate an express server
const app = express();
const serverPort = config.serverPort;
const server = app.listen(serverPort, () => {
  console.log("Express Server started on port " + serverPort + ".");
});

// middle-ware to load files that exist in the server, such as images
app.use(express.static(__dirname));

// mysql server credentials
const dbConn = mysql.createConnection({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName
});

// connect to the mysql server
dbConn.connect((error) => {
  if (error) {
    throw(error);
  }
  console.log("Connected to the MySQL server.");
});

// initiate a socket.io server
const io = socket(server);
io.on("connection", (socket) => {
  console.log("Client " + socket.id + " just connected!");

  // initiate listener classes
  new AccountListener(socket, dbConn);
  new MarkerListener(socket, dbConn);
  new LeaderboardListener(socket, dbConn);
});
