const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: String,
  type: String,
  createdAt: Date,
  payload: {},
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("payment", paymentSchema)),
  defaultSchema: mongoose.model("payment", paymentSchema),
};
