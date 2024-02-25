const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const quizSchema = new Schema({
  quizId: {
    type: ObjectId,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  answers: [
    {
      questionId: ObjectId,
      answerId: ObjectId,
    },
  ],
  score: Number,
});
quizSchema.index({ quizId: 1, userId: 1 }, { unique: true });
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("quiz", quizSchema)),
  defaultSchema: mongoose.model("quiz", quizSchema),
};
