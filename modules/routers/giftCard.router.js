const express = require("express");
const giftCardRouter = express.Router();
const roles = require("../../helpers/roles");
const giftCardController = require("../controllers/giftCard.controller");

giftCardRouter.get(
  "/",
  roles.isAuthenticatedAsAdmin,
  giftCardController.getAllData
);
giftCardRouter.post(
  "/",
  roles.isAuthenticatedAsAdmin,
  giftCardController.create
);
giftCardRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  giftCardController.findById
);
giftCardRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  giftCardController.updateGiftCard
);
giftCardRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  giftCardController.deleteGiftCard
);
module.exports = giftCardRouter;
