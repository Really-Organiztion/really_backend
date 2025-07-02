// Initiate Express Server
const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");
const session = require("express-session");

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server: server });

require("dotenv").config();
app.set("trust proxy", 1);
const indexRoutes = require("./index_routes");
const logger = require("./helpers/logging");

const allowedOrigins = [
  "https://reallybooking.com",
  "https://www.reallybooking.com",
  "http://localhost:49488",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (req.method === "OPTIONS") {
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  next();
});
app.use("/ReportServer", (req, res) => {
  res.status(403).json({ error: "Access denied" });
});

app.use("/geoserver", (req, res) => {
  res.status(403).json({ error: "Not available" });
});



require("./helpers/middleware")(app);
require("./helpers/db_handler")();
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

const port = process.env.PORT || 4000;
server.listen(port, function () {
  logger.info(`Server is listening on port : ${port}`);
});
require("./helpers/websocket").webs(wss);
module.exports = server;
