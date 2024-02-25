const express = require("express");
const promoCodeRouter = express.Router();
const promoCodeController = require("../controllers/promoCode.controller");
const roles = require("../../helpers/roles");

promoCodeRouter.get(
  "/",
  roles.isAuthenticatedAsAdmin,
  promoCodeController.getAllData
);
promoCodeRouter.post(
  "/",
  roles.isAuthenticatedAsAdmin,
  promoCodeController.create
);
promoCodeRouter.get(
  "/value",
  roles.isAuthenticatedAsUser,
  promoCodeController.findPromoValueByCode
);
promoCodeRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  promoCodeController.findById
);
promoCodeRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  promoCodeController.updatePromoCode
);
promoCodeRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  promoCodeController.deletePromoCode
);

module.exports = promoCodeRouter;
