const express = require("express");
const uploadFileRouter = express.Router();
const logger = require("../../helpers/logging");
const handleFiles = require("../../helpers/handleFiles");

uploadFileRouter.post("/", handleFiles.handleFileUpload);

module.exports = uploadFileRouter;
