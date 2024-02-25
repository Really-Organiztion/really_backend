const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const communitySchema = new Schema({
  courseId: {
    type: ObjectId,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  question: {
    type: String,
  },
  attachments: [String],
  answers: [
    {
      type: {
        type: String,
        enum: ["Text", "Attachment", "Link", "Voice"],
      },
      value: {
        type: String,
      },
    },
  ],
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("community", communitySchema)
  ),
  defaultSchema: mongoose.model("community", communitySchema),
};
