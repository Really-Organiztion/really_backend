const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const likeReelSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  reelId: {
    type: ObjectId,
    required: true,
    ref: "reel",
  },
});
likeReelSchema.index({ reelId: 1, userId: 1 }, { unique: true });

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("likeReel", likeReelSchema)),
  defaultSchema: mongoose.model("likeReel", likeReelSchema),
};
