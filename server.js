// Initiate Express Server
const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");
const session = require("express-session");

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server: server });

require("dotenv").config(); // Set .env values to process

const indexRoutes = require("./index_routes"); // this is for calling routes
const logger = require("./helpers/logging");

require("./helpers/middleware")(app); // this is for calling middleware
require("./helpers/db_handler")(); // this is for calling Data base
app.get("/test", (req, res, next) => {
  res.send("App express on vrecel is done");
});
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use("/api/", indexRoutes);
app.use("/attachments", express.static(path.join(__dirname, "./attachments")));
app.use(express.static("public"));

const port = process.env.PORT || 40001;
server.listen(port, function () {
  logger.info(`Server is listening on port : ${port}`);
});
require("./helpers/websocket").webs(wss); // this is for calling middleware
module.exports = server;
