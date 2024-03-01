const express = require("express");
const fcmRouter = express.Router();
const logger = require("../../helpers/logging");
const fireBase = require("../../helpers/fireBase");

fcmRouter.post("/", fireBase.sendFcm);

module.exports = fcmRouter;
