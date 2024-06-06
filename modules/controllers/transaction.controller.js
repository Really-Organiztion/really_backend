const transactionService = require("../services/transaction.service");
const walletService = require("../services/wallet.service");
const logger = require("../../helpers/logging");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
getAllData = (req, res) => {
  try {
    transactionService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let transaction = await transactionService.create(req, res);
    if (!transaction) {
      res.status(400).send("Can`t add transaction");
    } else {
      let where = {};
      if (transaction.walletId) {
        where["_id"] = new ObjectId(transaction.walletId);
      } else {
        where["userId"] = new ObjectId(transaction.userId);
        where["currencyId"] = new ObjectId(transaction.currencyId);
      }
      let wallet = await walletService.findOne(where);
      if (wallet) {
        if (transaction.type == "Payment") {
          if (transaction.amount > wallet.activeBalance + wallet.bonus) {
            transaction.status = "Error";
            await transactionService.updateCb(transaction, transaction._id);

            res.status(400).send("The wallet balance is insufficient");
            return;
          } else {
            if (wallet.activeBalance >= transaction.amount) {
              wallet.activeBalance = wallet.activeBalance - transaction.amount;
            } else {
              let remain = transaction.amount - wallet.activeBalance;
              wallet.activeBalance = transaction.amount - remain;
              wallet.bonus = wallet.bonus - remain;
            }
          }
        } else if (
          transaction.type == "Receive" &&
          transaction.status == "Completed"
        ) {
          wallet.holdBalance += transaction.amount;
        } else if (
          transaction.type == "Bonus" &&
          transaction.status == "Completed"
        ) {
          wallet.bonus += transaction.amount;
        }
        let walletUpdated = await walletService.updateCb(wallet, wallet._id);
        if (walletUpdated) {
          res.status(200).send(transaction);
        } else {
          res.status(400).send("Can`t update Wallet balance");
        }
      } else {
        res.status(400).send("Can`t update Wallet balance");
      }
    }
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

updateTransactionStatus = async (req, res) => {
  try {
    let transaction = await transactionService.findOne({ _id: req.params.id });
    if (!transaction) {
      res.status(400).send("Can`t Find transaction");
    } else {
      let where = {};
      if (transaction.walletId) {
        where["_id"] = new ObjectId(transaction.walletId);
      } else {
        where["userId"] = new ObjectId(transaction.userId);
        where["currencyId"] = new ObjectId(transaction.currencyId);
      }
      let wallet = await walletService.findOne(where);
      if (wallet) {
        if (transaction.type == "Deposit" && req.body.status == "Processing") {
          if (
            req.body.sessionData &&
            req.body.sessionData.paymentStatus == "paid"
          ) {
            transaction.sessionData = req.body.sessionData;
            transaction.status = "Completed";
            wallet.activeBalance += transaction.amount;
            await transactionService.updateCb(transaction, transaction._id);
          } else {
            transaction.status = "Error";
            await transactionService.updateCb(transaction, transaction._id);
            res.status(400).send("The wallet balance is insufficient");
            return;
          }
        } else if (
          transaction.type == "Withdraw" &&
          transaction.status == "Completed"
        ) {
          wallet.activeBalance -= transaction.amount;
        } else if (transaction.type == "Active") {
          wallet.holdBalance -= transaction.amount;
          wallet.activeBalance += transaction.amount;
        }
        let walletUpdated = await walletService.updateCb(wallet, wallet._id);
        if (walletUpdated) {
          res.status(200).send(transaction);
        } else {
          res.status(400).send("Can`t update Wallet balance");
        }
      } else {
        res.status(400).send("Can`t update Wallet balance");
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

// updateTransactionStatus = (req, res) => {
//   try {
//     const id = req.params.id;
//     transactionService.updateTransactionStatus(req, res, id);
//   } catch (error) {
//     logger.error(error);
//   }
// };
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
  updateTransactionStatus,
  updateTransaction,
  deleteTransaction,
};
