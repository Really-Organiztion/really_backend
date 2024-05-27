const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const bookingSchema = new Schema(
  {
    unitId: {
      type: ObjectId,
      required: true,
      ref: "unit",
    },
    postId: {
      type: ObjectId,
      required: true,
      ref: "post",
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    plan: {
      type: {
        type: String,
        required: true,
        enum: ["Hours", "Daily", "Weekly", "Monthly", "Yearly"],
      },
      price: {
        type: Number,
      },
      pricingType: {
        type: String,
        required: true,
        enum: ["Fully", "Partly"],
      },
      insReq: {
        type: Boolean,
      },
      insType: {
        type: String,
        required: true,
        enum: ["Fixed", "Custom"],
      },
      insPrice: {
        type: Number,
      },
      currencyId: {
        type: ObjectId,
        ref: "currency",
      },
      currencyCode: {
        type: String,
      },
    },
    appointments : [],
    status: {
      type: String,
      enum: ["Selected","UnderReview", "Activated", "Stopped","Canceled","Finished"],
      default: "Selected",
    },
    firstDate: {
      type: Date,
    },
    lastDate: {
      type: Date,
    },
    count: {
      type: Number,
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
  genericSchema: genericOperations(mongoose.model("booking", bookingSchema)),
  defaultSchema: mongoose.model("booking", bookingSchema),
};
