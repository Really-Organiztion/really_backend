const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/pay", paymentController.initiatePayment);
router.get("/callback", paymentController.callbackHandler);

module.exports = router;
