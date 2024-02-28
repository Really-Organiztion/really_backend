const walletService = require("../services/wallet.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    walletService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    walletService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    walletService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateWalletStatus = (req, res) => {
  try {
    const id = req.params.id;
    walletService.updateWalletStatus(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateWallet = (req, res) => {
  try {
    const id = req.params.id;
    walletService.updateWallet(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteWallet = (req, res) => {
  try {
    const id = req.params.id;
    walletService.deleteWallet(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateWalletStatus,
  updateWallet,
  deleteWallet,
};
