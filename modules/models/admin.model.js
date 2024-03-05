const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const adminSchema = new Schema({
  adminId: {
    type: ObjectId,
    required: true,
    ref: "admin",
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }, 
  role: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4,5,6,7,8,9,10],
  },
},{
  timestamps: true,
  useCreateIndex: true,
  autoIndex: true,
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("admin", adminSchema)),
  defaultSchema: mongoose.model("admin", adminSchema),
};