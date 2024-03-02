const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const walletSchema = new Schema({
  activeBalance: {
    type: Number,
    default: 0,
  },
  holdBalance: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  currencyId: {
    type: ObjectId,
    required: true,
    ref: "currency",
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  pin: {
    type: String,
    uniqe: [true, "Pin existing , Not available"],
    required: [true, "Pin Required ! "],
  },
  status: {
    type: String,
    enum: ["UnderReview", "Working", "Stopped"],
    default: "UnderReview",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("wallet", walletSchema)),
  defaultSchema: mongoose.model("wallet", walletSchema),
};
