const serviceTypeService = require("../services/serviceType.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    serviceTypeService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    serviceTypeService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    serviceTypeService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateServiceType = (req, res) => {
  try {
    const id = req.params.id;
    serviceTypeService.updateServiceType(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteServiceType = (req, res) => {
  try {
    const id = req.params.id;
    serviceTypeService.deleteServiceType(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateServiceType,
  deleteServiceType,
};
