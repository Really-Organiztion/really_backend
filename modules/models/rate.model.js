const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const rateSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  unitId: {
    type: ObjectId,
    required: true,
    ref: "unit",
  },
});
rateSchema.index({ unitId: 1, userId: 1 }, { unique: true });

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("rate", rateSchema)),
  defaultSchema: mongoose.model("rate", rateSchema),
};
