const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const constants = require("./constants.json");

module.exports = function (app) {
  // app.use(express.json()); //req.body
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );
  app.use(compression());
  app.use(cors());
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(
    rateLimit({
      windowMs: constants.rateLimit.windowMs,
      max: constants.rateLimit.maxRequestsNumber,
    })
  );
  // use helmet to protect project from some security issues
  app.use(helmet());
};
