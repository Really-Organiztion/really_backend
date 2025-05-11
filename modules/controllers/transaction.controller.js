const transactionService = require("../services/transaction.service");
const walletService = require("../services/wallet.service");
const logger = require("../../helpers/logging");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
thawaniSession = async (req, res) => {
  try {
    let body = req.body;
    let transaction = await transactionService.findOne({
      transactionNo: body.transactionNo,
      userId: new ObjectId(body.userId),
    });
    if (!transaction) {
      res.status(400).json({ error: "Transaction is not found" });
      return;
    }
    
    let wallet = await walletService.findOne({
      _id: new ObjectId(transaction.walletId),
    });
    if (!wallet) {
      res.status(400).json({ error: "Wallet is not found" });
      return;
    }
    if (wallet.userId.toString() != transaction.userId.toString()) {
      res.status(400).json({ error: "Wallet is not found" });
      return;
    }
    
    if (!transaction?.sessionData?.sessionId) {
      res.status(400).json({ error: "Transaction session is not found" });
      return;
    }
    
    let thawaniResponse = await transactionService.thawaniSession(
      transaction,
      res
    );
    
    if (thawaniResponse.done) {
      if (thawaniResponse.doc.done) {
        if (
          body.status == "canceled" &&
          thawaniResponse.doc?.data?.payment_status == "unpaid"
        ) {
          transactionService.deleteCb(transaction._id);
        } else if (
          body.status == "success" &&
          thawaniResponse.doc?.data.payment_status == "paid"
        ) {
          wallet.activeBalance += transaction.amount;
          walletService.updateCb(wallet, wallet._id);
        }
      }
      res.status(200).send(thawaniResponse.doc);
    } else {
      res.status(400).send(thawaniResponse);
    }
  } catch (error) {
    
    logger.error(error);
  }
};

getAllData = (req, res) => {
  try {
    transactionService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    createTransaction(req, (err, obj) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(obj);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

createTransaction = async (req, callBack) => {
  callBack = callBack || function () {};
  let transaction = req.body;
  // let transaction = await transactionService.create(req);
  // if (!transaction) {
  //   callBack("Can`t add transaction",null)
  //   return
  // } else {
  let where = {};
  if (transaction?.walletId) {
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
        let _transaction = await transactionService.create({
          body: transaction,
        });
        await transactionService.updateCb(transaction, transaction._id);
        callBack("The wallet balance is insufficient", null);
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
    let _transaction = await transactionService.create({ body: transaction });
    let walletUpdated = await walletService.updateCb(wallet, wallet._id);
    if (walletUpdated) {
      callBack(null, _transaction);
      return;
    } else {
      callBack("Can`t update Wallet balance", null);
      return;
    }
  } else {
    callBack("Wallet Not Found", null);
    return;
  }
  // }
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
            transaction = await transactionService.updateCb(
              transaction,
              transaction._id
            );
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
        } else {
          transaction = await transactionService.updateCb(
            req.body,
            transaction._id
          );
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
  thawaniSession,
  create,
  findById,
  updateTransactionStatus,
  updateTransaction,
  createTransaction,
  deleteTransaction,
};
