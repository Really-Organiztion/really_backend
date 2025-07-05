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
      res.status(400).json({ error: "The user does not own this wallet" });
      return;
    }

    if (!transaction?.sessionData?.session_id) {
      res.status(400).json({ error: "Transaction session is not found" });
      return;
    }

    let thawaniResponse = await transactionService.thawaniSession(
      transaction,
      body.is_test,
      res
    );

    if (thawaniResponse.done) {
      transaction.sessionData = thawaniResponse.doc.data;

      if (
        (body.status == "cancel" &&
          thawaniResponse.doc?.data?.payment_status == "unpaid") ||
        thawaniResponse.doc?.data?.payment_status == "cancelled"
      ) {
        transactionService.deleteCb(transaction._id);
        transaction.status = "Canceled";
      } else if (
        body.status == "success" &&
        thawaniResponse.doc?.data.payment_status == "paid"
      ) {
        if (transaction.status != "Completed") {
          wallet.activeBalance += transaction.amount;
          walletService.updateCb(wallet, wallet._id);
        }

        transaction.status = "Completed";
        transactionService.updateCb(transaction, transaction._id);
      } else if (
        body.status == "success" &&
        thawaniResponse.doc?.data.payment_status != "paid"
      ) {
        res.status(400).send(thawaniResponse);
        return;
      }

      res.status(200).send(transaction);
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await createTransaction(req, session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).send(result);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).send({ error: err.message || err });
  }
};

const createTransaction = async (req, session) => {
  let transaction = req.body;
  let where = {};

  if (transaction?.walletId) {
    where["_id"] = new ObjectId(transaction.walletId);
  } else {
    where["userId"] = new ObjectId(transaction.userId);
    where["currencyId"] = new ObjectId(transaction.currencyId);
  }

  const wallet = await walletService.findOne(where, session);
  if (!wallet) {
    throw new Error("Wallet Not Found");
  }

  if (transaction.type === "Payment") {
    if (transaction.amount > wallet.activeBalance + wallet.bonus) {
      transaction.status = "Error";
      const _transaction = await transactionService.create(
        { body: transaction },
        session
      );
      await transactionService.updateCb(transaction, transaction._id, session);
      throw new Error("The wallet balance is insufficient");
    } else {
      if (wallet.activeBalance >= transaction.amount) {
        wallet.activeBalance -= transaction.amount;
      } else {
        const remain = transaction.amount - wallet.activeBalance;
        wallet.activeBalance = 0;
        wallet.bonus -= remain;
      }
    }
  } else if (
    transaction.type === "Receive" &&
    transaction.status === "Completed"
  ) {
    wallet.holdBalance += transaction.amount;
  } else if (
    transaction.type === "Bonus" &&
    transaction.status === "Completed"
  ) {
    wallet.bonus += transaction.amount;
  }

  const _transaction = await transactionService.create(
    { body: transaction },
    session
  );
  const walletUpdated = await walletService.updateCb(
    wallet,
    wallet._id,
    session
  );

  if (!walletUpdated) {
    throw new Error("Can't update Wallet balance");
  }

  return _transaction;
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let transaction = await transactionService.findOne({ _id: req.params.id });
    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Can't find transaction");
    }

    let where = {};
    if (transaction.walletId) {
      where["_id"] = new ObjectId(transaction.walletId);
    } else {
      where["userId"] = new ObjectId(transaction.userId);
      where["currencyId"] = new ObjectId(transaction.currencyId);
    }

    let wallet = await walletService.findOne(where);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Wallet not found");
    }

    if (transaction.type === "Deposit" && req.body.status === "Processing") {
      if (req.body.sessionData?.payment_status === "paid") {
        transaction.sessionData = req.body.sessionData;
        transaction.status = "Completed";
        wallet.activeBalance += transaction.amount;
        transaction = await transactionService.updateCb(
          transaction,
          transaction._id,
          session
        );
      } else {
        transaction.status = "Error";
        await transactionService.updateCb(
          transaction,
          transaction._id,
          session
        );
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send("The wallet balance is insufficient");
      }
    } else if (
      transaction.type === "Withdraw" &&
      transaction.status === "Completed"
    ) {
      wallet.activeBalance -= transaction.amount;
    } else if (transaction.type === "Active") {
      wallet.holdBalance -= transaction.amount;
      wallet.activeBalance += transaction.amount;
    } else {
      transaction = await transactionService.updateCb(
        req.body,
        transaction._id,
        session
      );
    }

    const walletUpdated = await walletService.updateCb(
      wallet,
      wallet._id,
      session
    );

    if (!walletUpdated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("Can't update Wallet balance");
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).send(transaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error);
    res.status(500).send("Internal Server Error");
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
