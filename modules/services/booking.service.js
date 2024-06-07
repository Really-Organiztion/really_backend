const bookingModel = require("../models/booking.model");
const webSocket = require("../../helpers/websocket");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
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

  if (req.body.unitId) {
    where["unitId"] = new ObjectId(req.body.unitId);
  }

  if (req.body.postId) {
    where["postId"] = new ObjectId(req.body.postId);
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
      $lt: d2,
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
      $lt: d2,
    };
  }

  bookingModel.defaultSchema
    .find(where)
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
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
updateBookingStatus = async (req, res, id) => {
  bookingModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { status: req.body.status },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      res.status(200).send(`New Status is ${req.body.status}`);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

create = async (req, res) => {
  bookingModel.defaultSchema
    .create(req.body)
    .then(function (doc) {
      webSocket.sendBooking(doc);
      res.status(200).send(doc);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteBooking: bookingModel.genericSchema.delete,
  updateBooking: bookingModel.genericSchema.update,
  updateBookingStatus,
  findById: bookingModel.genericSchema.findById,
  create,
  findAll,
};
