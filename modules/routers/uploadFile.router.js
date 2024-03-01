const express = require("express");
const uploadFileRouter = express.Router();
const logger = require("../../helpers/logging");
const handleFiles = require("../../helpers/handleFiles");

uploadFileRouter.post("/:pathName/:fileType", handleFiles.handleFileUpload);

module.exports = uploadFileRouter;
