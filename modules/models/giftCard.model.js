const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const giftCardSchema = new Schema({
  type: {
    type: String,
    enum: ["forAll", "forGroup"],
    required: true,
  },
  subjectId: {
    type: ObjectId,
    ref: "subject",
  },
  educationSystemId: {
    type: ObjectId,
    ref: "educationSystem",
  },
  gradeId: {
    type: ObjectId,
    ref: "grade",
  },
  teacherId: {
    type: ObjectId,
    ref: "teacher",
  },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("giftCard", giftCardSchema)),
  defaultSchema: mongoose.model("giftCard", giftCardSchema),
};
