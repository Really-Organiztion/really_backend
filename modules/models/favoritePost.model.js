const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const favoritePostSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  postId: {
    type: ObjectId,
    required: true,
    ref: "post",
  },
});
favoritePostSchema.index({ postId: 1, userId: 1 }, { unique: true });

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("favoritePost", favoritePostSchema)),
  defaultSchema: mongoose.model("favoritePost", favoritePostSchema),
};
