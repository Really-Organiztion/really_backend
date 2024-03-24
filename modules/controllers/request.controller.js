const requestService = require("../services/request.service");
const logger = require("../../helpers/logging");
const crypto = require("crypto");

getAllData = (req, res) => {
  try {
    requestService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    req.body.code = crypto.randomBytes(6).toString("hex");
    requestService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    requestService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateRequest = (req, res) => {
  try {
    const id = req.params.id;
    requestService.updateRequest(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteRequest = (req, res) => {
  try {
    const id = req.params.id;
    requestService.deleteRequest(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
isDeleteRequest = (req, res) => {
  try {
    const id = req.params.id;
    requestService.isDeleteRequest(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteAllRequest = (req, res) => {
  try {
    requestService.deleteAllRequest(req, res);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  isDeleteRequest,
  findById,
  updateRequest,
  deleteRequest,
  deleteAllRequest,
};
