const reportService = require("../services/report.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    reportService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    reportService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    reportService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateReport = (req, res) => {
  try {
    const id = req.params.id;
    reportService.updateReport(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteReport = (req, res) => {
  try {
    const id = req.params.id;
    reportService.deleteReport(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateReport,
  deleteReport,
};
