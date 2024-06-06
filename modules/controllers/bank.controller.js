const bankService = require("../services/bank.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    bankService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    bankService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    bankService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateBankStatus = (req, res) => {
  try {
    const id = req.params.id;
    bankService.updateBankStatus(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateBank = (req, res) => {
  try {
    const id = req.params.id;
    bankService.updateBank(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteBank = (req, res) => {
  try {
    const id = req.params.id;
    bankService.deleteBank(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateBankStatus,
  updateBank,
  deleteBank,
};
