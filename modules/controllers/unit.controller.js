const unitService = require("../services/unit.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    unitService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findCoordinatesMatch = (req, res) => {
  try {
    unitService.findCoordinatesMatch(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findNearUnits = (req, res) => {
  try {
    unitService.findNearUnits(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findNearUnitsToPosts = (req, res) => {
  try {
    unitService.findNearUnitsToPosts(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    unitService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    unitService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateUnit = (req, res) => {
  try {
    const id = req.params.id;
    unitService.updateUnit(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteUnit = (req, res) => {
  try {
    const id = req.params.id;
    unitService.deleteUnit(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  findCoordinatesMatch,
  findNearUnits,
  findNearUnitsToPosts,
  create,
  findById,
  updateUnit,
  deleteUnit,
};
