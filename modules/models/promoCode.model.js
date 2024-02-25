const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
  promoCode: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: String,
    enum: ["byAmount", "byPercentage"],
    required: true,
  },
  value: { type: String, required: true },
  expiryDate: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("promoCode", promoCodeSchema)
  ),
  defaultSchema: mongoose.model("promoCode", promoCodeSchema),
};
