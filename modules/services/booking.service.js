const bookingModel = require("../models/booking.model");
const webSocket = require("../../helpers/websocket");
const customMethods = require("../../helpers/custom-methods");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const unitModel = require("../models/unit.model");

findAll = (req, res) => {
  let sort = { createdAt: -1 };
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};

  if (!req.body || !req.body.isDeleted) {
    where["isDeleted"] = false;
  }

  if (req.body.userId) {
    where["userId"] = new ObjectId(req.body.userId);
  }

  if (req.body.code) {
    where["code"] = new RegExp(req.body.code, "i");
  }
  if (req.body.unitId) {
    where["unitId"] = new ObjectId(req.body.unitId);
  }

  if (req.body.postId) {
    where["postId"] = new ObjectId(req.body.postId);
  }

  if (where["sortByPrice"]) {
    if (where["sortByPrice"] == "asc") {
      sort = { "plan.price": 1 };
    } else if (where["sortByPrice"] == "desc") {
      sort = { "plan.price": -1 };
    }
    delete where["sortByPrice"];
  }
  if (where["sortByDates"]) {
    if (where["sortByDates"] == "asc") {
      sort = { createdAt: 1, _id: 1 };
    } else if (where["sortByDates"] == "desc") {
      sort = { createdAt: -1, _id: -1 };
    }
    delete where["sortByDates"];
  }

  if (where && where.firstDateTo) {
    let d1 = new Date(where.firstDate);
    let d2 = new Date(where.firstDateTo);
    d2.setDate(d2.getDate() + 1);
    where.firstDate = {
      $gte: d1,
      $lt: d2,
    };
    delete where.firstDateTo;
  } else if (where.firstDate) {
    let d1 = new Date(where.firstDate);
    let d2 = new Date(where.firstDate);
    d2.setDate(d2.getDate() + 1);
    where.firstDate = {
      $gte: d1,
      // $lt: d2,
    };
  }

  if (where && where.lastDateTo) {
    let d1 = new Date(where.lastDate);
    let d2 = new Date(where.lastDateTo);
    d2.setDate(d2.getDate() + 1);
    where.lastDate = {
      $gte: d1,
      $lt: d2,
    };
    delete where.lastDateTo;
  } else if (where.lastDate) {
    let d1 = new Date(where.lastDate);
    let d2 = new Date(where.lastDate);
    d2.setDate(d2.getDate() + 1);
    where.lastDate = {
      $gte: d1,
      // $lt: d2,
    };
  }

  bookingModel.defaultSchema
    .find(where)
    .sort(sort)
    .skip((pageNumber - 1) * pageSize)
    .select({ status: 1, firstDate: 1, lastDate: 1, "plan.type": 1 })
    .limit(pageSize)
    // .populate("unitId", ["type"])
    // .populate("plan.currencyId", [`${toFound}`, "code", "numericCode", "color"])
    // .populate("userId", ["username", "phone"])
    .then(function (data) {
      let _data = [];
      for (let i = 0; i < data.length; i++) {
        if (
          new Date() >= new Date(data[i].lastDate) &&
          data[i].status == "Activated"
        ) {
          bookingModel.defaultSchema
            .findByIdAndUpdate(data[i]._id.toString(), {
              $set: { status: "Finished" },
              new: true,
              setDefaultsOnInsert: true,
            })
            .then(function (data1) {})
            .catch(function (err1) {});
        } else {
          _data.push(data[i]);
        }
      }
      res.status(200).send(_data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findAllPrivate = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const where = req.body || {};
    const now = new Date();
    const match = { isDeleted: false };

    let unitIds = null;
    if (where.linkedById) {
      unitIds = await unitModel.defaultSchema
        .find({ "linkedBy.userId": new ObjectId(where.linkedById) })
        .select("_id")
        .lean()
        .exec();
      if (!unitIds.length) return res.status(200).send([]);
      match.unitId = { $in: unitIds.map((u) => u._id) };
      delete where.linkedById;
    }

    ["userId", "unitId", "postId"].forEach((field) => {
      if (where[field]) match[field] = new ObjectId(where[field]);
    });

    if (req.body.code) {
      match["code"] = new RegExp(req.body.code, "i");
    }
    // const handleDate = (field) => {
    //   if (where[`${field}To`] || where[field]) {
    //     const from = new Date(where[field]);
    //     const to = new Date(where[`${field}To`] || where[field]);
    //     to.setDate(to.getDate() + 1);
    //     match[field] = { $gte: from, $lt: to };
    //   }
    //   delete where[field];
    //   delete where[`${field}To`];
    // };

    // handleDate("firstDate");
    // handleDate("lastDate");
    if (where && where.firstDateTo) {
      let d1 = new Date(where.firstDate);
      let d2 = new Date(where.firstDateTo);
      d2.setDate(d2.getDate() + 1);
      match.firstDate = {
        $gte: d1,
        $lt: d2,
      };
    } else if (where.firstDate) {
      let d1 = new Date(where.firstDate);
      let d2 = new Date(where.firstDate);
      d2.setDate(d2.getDate() + 1);
      match.firstDate = {
        $gte: d1,
        // $lt: d2,
      };
    }

    if (where && where.lastDateTo) {
      let d1 = new Date(where.lastDate);
      let d2 = new Date(where.lastDateTo);
      d2.setDate(d2.getDate() + 1);
      match.lastDate = {
        $gte: d1,
        $lt: d2,
      };
    } else if (where.lastDate) {
      let d1 = new Date(where.lastDate);
      let d2 = new Date(where.lastDate);
      d2.setDate(d2.getDate() + 1);
      match.lastDate = {
        $gte: d1,
        // $lt: d2,
      };
    }

    let sort = { createdAt: -1 };
    if (where.sortByPrice) {
      sort = { "plan.price": where.sortByPrice === "asc" ? 1 : -1 };
    } else if (where.sortByDates) {
      const direction = where.sortByDates === "asc" ? 1 : -1;
      sort = { createdAt: direction, _id: direction };
    }

    const pipeline = [
      { $match: match },

      {
        $addFields: {
          status: {
            $cond: [
              {
                $and: [
                  { $lte: ["$lastDate", now] },
                  { $eq: ["$status", "Activated"] },
                ],
              },
              "Finished",
              "$status",
            ],
          },
        },
      },

      { $sort: sort },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },

      // {
      //   $lookup: {
      //     from: "units",
      //     localField: "unitId",
      //     foreignField: "_id",
      //     as: "unit",
      //   },
      // },
      // { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    ];

    const results = await bookingModel.defaultSchema.aggregate(pipeline).exec();
    res.status(200).send(results);
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).send({ error: err.message || err });
  }
};

updateBookingStatus = async (req, res, id) => {
  bookingModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { status: req.body.status },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      if (!data || !data._id) {
        res.status(400).send("Booking is not found");
        return;
      }
      res.status(200).send(`New Status is ${req.body.status}`);
      return;
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

updateReceiptStatus = async (req, res, type, id) => {
  bookingModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { [type]: req.body.status },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      if (!data || !data._id) {
        res.status(400).send("Booking is not found");
        return;
      }
      res.status(200).send(`New ${type} Status is ${req.body.status}`);
      return;
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

updateReceiptStatusForWS = (id, type, status) => {
  bookingModel.defaultSchema
    .updateOne(
      { _id: id },
      { $set: { [type]: status } },
      { new: true, setDefaultsOnInsert: true }
    )
    .then((res) => {
      console.log("Update result:", res);
    })
    .catch((err) => {
      console.error("Update error:", err);
    });
};

create = async (req, session) => {
  req.body.firstDate = customMethods.stripTimezone(req.body.firstDate);
  req.body.lastDate = customMethods.stripTimezone(req.body.lastDate);
  req.body.code = `${req.body.plan.type}-${req.body.plan.price}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const booking = new bookingModel.defaultSchema(req.body);
  await booking.save({ session });
  webSocket.sendBooking(booking);
  return booking;
};

updateBooking = (req, res, id) => {
  if (req.body.firstDate) {
    req.body.firstDate = customMethods.stripTimezone(req.body.firstDate);
  }
  if (req.body.lastDate) {
    req.body.lastDate = customMethods.stripTimezone(req.body.lastDate);
  }
  bookingModel.defaultSchema
    .findByIdAndUpdate(id, req.body, {
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findExistingBooking = async (unitId, firstDate, lastDate) => {
  try {
    
    const result = await bookingModel.defaultSchema.findOne({
      unitId: new mongoose.Types.ObjectId(unitId),
      $or: [
        {
          firstDate: { $lt: lastDate },
          lastDate: { $gt: firstDate },
        },
      ],
    });
    return result;
  } catch (err) {
    console.error(
      "An error occurred while searching for the watch:",
      err.message
    );
    return null;
  }
};

module.exports = {
  deleteBooking: bookingModel.genericSchema.delete,
  updateBooking,
  updateBookingStatus,
  updateReceiptStatus,
  updateReceiptStatusForWS,
  findById: bookingModel.genericSchema.findById,
  create,
  findExistingBooking,
  findAll,
  findAllPrivate,
};
