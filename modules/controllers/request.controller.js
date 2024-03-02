const requestService = require("../services/request.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    requestService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
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

deleteAllRequest = (req, res) => {
  try {
    const userId = req.params.userId;
    requestService.deleteAllRequest(req, res, userId);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateRequest,
  deleteRequest,
  deleteAllRequest,
};
