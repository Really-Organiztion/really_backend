// Initiate Express Server
const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server, path: "/websocket" });

require("dotenv").config(); // Set .env values to process

const indexRoutes = require("./index_routes"); // this is for calling routes
const logger = require("./helpers/logging");

require("./helpers/middleware")(app); // this is for calling middleware
require("./helpers/websocket")(wss); // this is for calling middleware
require("./helpers/db_handler")(); // this is for calling Data base

app.use("/api/", indexRoutes);
app.use("/attachments", express.static(path.join(__dirname, "./attachments")));
app.use(express.static("public"));

const port = process.env.SERVER_PORT || 3000;
server.listen(port, function () {
  logger.info(`Server is listening on port : ${port}`);
});

module.exports = server;
