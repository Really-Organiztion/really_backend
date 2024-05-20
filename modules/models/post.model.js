const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
      enum: ["Investment", "Rent"],
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    unitId: {
      type: ObjectId,
      required: true,
      ref: "unit",
    },
 
    plansList: [
      {
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
    ],
    setting: {
      openToBooking: {
        type: Boolean,
      },
      showInExplore: {
        type: Boolean,
      },
      showInMap: {
        type: Boolean,
      },
      showRate: {
        type: Boolean,
      },
      show3D: {
        type: Boolean,
      },
      showUser: {
        type: Boolean,
      },
    },
    favorites: {
      type: Number,
      default: 0,
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
postSchema.index(
  { target: 1, unitId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

const genericOperations = require("../genericService");
const currencyModel = require("./currency.model");
module.exports = {
  genericSchema: genericOperations(mongoose.model("post", postSchema)),
  defaultSchema: mongoose.model("post", postSchema),
};
