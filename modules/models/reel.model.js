const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reelSchema = new Schema({

  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  imagesList: [
    {
      url: {
        type: String,
      },
    },
  ],
  video: {
    url: {
      type: String,
    },
  },
  link : {
    type : String,
  },
  caption : {
    type : String,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  isDeleted : {
    type : Boolean,
    default : false
  }
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("reel", reelSchema)),
  defaultSchema: mongoose.model("reel", reelSchema),
};
