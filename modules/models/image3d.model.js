const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const image3dSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  unitId: {
    type: ObjectId,
    ref: "unit",
  },
  subUnitId: {
    type: ObjectId,
    ref: "unit",
  },
  itemButtonList: [{
    latitude : {type : Number},
    longitude : {type : Number},
    text : {type : String},
    details : {type : String},
  }],
  roomDoorList: [{
    latitude : {type : Number},
    longitude : {type : Number},
    threeDViewId : {type : String},
    type : {type : String},
  }],
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("image3d", image3dSchema)),
  defaultSchema: mongoose.model("image3d", image3dSchema),
};
