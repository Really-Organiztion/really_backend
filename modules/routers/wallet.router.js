const express = require("express");
const walletRouter = express.Router();
const walletController = require("../controllers/wallet.controller");
const roles = require("../../helpers/roles");

walletRouter.get("/", walletController.getAllData);
walletRouter.post("/", roles.isAuthenticatedAsAdmin, walletController.create);

walletRouter.get("/:id", roles.isAuthenticatedAsAdmin, walletController.findById);
walletRouter.put(
  "/:id",
  walletController.updateWallet
);
walletRouter.put(
  "/updateStatus/:id",
  roles.isAuthenticatedAsAdmin,
  walletController.updateWalletStatus
);
walletRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  walletController.deleteWallet
);

module.exports = walletRouter;
