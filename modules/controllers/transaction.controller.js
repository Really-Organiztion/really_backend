const transactionService = require("../services/transaction.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    transactionService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    transactionService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    transactionService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTransactionType = (req, res) => {
  try {
    const id = req.params.id;
    transactionService.updateTransactionType(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTransaction = (req, res) => {
  try {
    const id = req.params.id;
    transactionService.updateTransaction(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteTransaction = (req, res) => {
  try {
    const id = req.params.id;
    transactionService.deleteTransaction(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateTransactionType,
  updateTransaction,
  deleteTransaction,
};
