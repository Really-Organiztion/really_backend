const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transactionSchema = new Schema(
  {
    walletId: {
      type: ObjectId,
      required: true,
      ref: "wallet",
    },
    transactionNo: {
      type: Number,
      required: true,
    },
    transactionBy: {
      type: String,
      required: true,
      enum: ["ThawaniGate"],
    },
    type: {
      type: String,
      enum: [
        "Deposit",
        "Payment",
        "Receive",
        "Withdraw",
        "Bonus",
        "Active",
        "Disabled",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "NewTransaction",
        "Processing",
        "Ignored",
        "Canceled",
        "Completed",
        "Error",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    currencyId: {
      type: ObjectId,
      required: true,
      ref: "currency",
    },
    currencyCode: {
      type: String,
    },
    sessionData: {},
    data: {},
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("transaction", transactionSchema)
  ),
  defaultSchema: mongoose.model("transaction", transactionSchema),
};
