const express = require("express");
const uploadFileRouter = express.Router();
const logger = require("../../helpers/logging");
const handleFiles = require("../../helpers/handleFiles");
uploadFileRouter.post("/:pathName/:fileType", handleFiles.handleFileUpload);
uploadFileRouter.post("/files/:pathName/:fileType", handleFiles.handleFilesUpload);
uploadFileRouter.get("/:pathName/:fileType/:fileName", handleFiles.getFile);
uploadFileRouter.delete("/", handleFiles.deleteFile);
module.exports = uploadFileRouter;