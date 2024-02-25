const express = require("express");
const paymentRouter = express.Router();
const paymentController = require("../controllers/payment.controller");

paymentRouter.post(
  "/key",
  paymentController.generatePaymentKeyWithOrderRegistration
);
paymentRouter.post(
  "/notification-callback",
  paymentController.notificationCallback
);
paymentRouter.get("/response-callback", paymentController.responseCallback);

module.exports = paymentRouter;
