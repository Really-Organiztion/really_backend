const express = require("express");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transaction.controller");
const roles = require("../../helpers/roles");

transactionRouter.post("/all", transactionController.getAllData);
transactionRouter.post("/",  transactionController.create);

transactionRouter.get("/:id",  transactionController.findById);
transactionRouter.put(
  "/:id",
  transactionController.updateTransaction
);
transactionRouter.put(
  "/updateType/:id",
  
  transactionController.updateTransactionType
);
transactionRouter.delete(
  "/:id",
  
  transactionController.deleteTransaction
);

module.exports = transactionRouter;
