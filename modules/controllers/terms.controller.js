const termsService = require("../services/terms.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    termsService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    termsService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    termsService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTerms = (req, res) => {
  try {
    const id = req.params.id;
    termsService.updateTerms(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteTerms = (req, res) => {
  try {
    const id = req.params.id;
    termsService.deleteTerms(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

deleteReturn = (req, res) => {
  try {
    const id = req.params.id;
    termsService.deleteReturn(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateTerms,
  deleteTerms,
  deleteReturn,
};
