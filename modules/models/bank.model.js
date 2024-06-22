const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const bankSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    nameAr: {
      type: String,
      required: true,
      unique: true,
    },
    accountNo: {
      type: String,
      required: true,
    },
    iban: {
      type: String,
      required: true,
    },
    swiftCode: {
      type: String,
      required: true,
    },
    currencyId: {
      type: ObjectId,
      required: true,
      ref: "currency",
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
  genericSchema: genericOperations(mongoose.model("bank", bankSchema)),
  defaultSchema: mongoose.model("bank", bankSchema),
};
