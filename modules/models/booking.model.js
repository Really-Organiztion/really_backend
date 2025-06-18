const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ReceiptStatus = [
  "Waiting",
  "Ready",
  "OnTheWay",
  "InLocation",
  "CheckIn",
  "CheckUnit",
  "Receipt",
  "InUnit",
  "CheckUnitBack",
  "CheckOut",
  "Leaving",
  "Finished",
  "Cancelled",
];
const bookingSchema = new Schema(
  {
    code: { type: String, unique: true },
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
      minLimit: {
        type: Number,
      },
      maxLimit: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: [
        "Selected",
        "UnderReview",
        "Activated",
        "Stopped",
        "Canceled",
        "Finished",
      ],
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
    takeoverStatus: {
      type: String,
      enum: ReceiptStatus,
      default: "waiting",
    },
    handoverStatus: {
      type: String,
      enum: ReceiptStatus,
      default: "waiting",
    },
    payEvery: {
      type: Number,
      default: 0,
    },
    paidCounts: {
      type: Number,
      default: 0,
    },
    refId: {
      type: ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
bookingSchema.index({ unitId: 1, firstDate: 1, lastDate: 1 });

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("booking", bookingSchema)),
  defaultSchema: mongoose.model("booking", bookingSchema),
};
