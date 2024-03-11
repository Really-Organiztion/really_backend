const express = require("express");
const walletRouter = express.Router();
const walletController = require("../controllers/wallet.controller");
const roles = require("../../helpers/roles");

walletRouter.get("/", walletController.getAllData);
walletRouter.post("/",  walletController.create);

walletRouter.get("/:id",  walletController.findById);
walletRouter.put(
  "/:id",
  walletController.updateWallet
);
walletRouter.put(
  "/updateStatus/:id",
  
  walletController.updateWalletStatus
);
walletRouter.delete(
  "/:id",
  
  walletController.deleteWallet
);

module.exports = walletRouter;
