const image3dModel = require("../models/image3d.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const handleFiles = require("../../helpers/handleFiles");

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";

  let $match = { ...req.body };
  if ($match.unitId) {
    $match.unitId = new ObjectId(req.body.unitId);
  }
  image3dModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
          url: { $first: `$url` },
          unitId: { $first: `$unitId` },
          subUnitId: { $first: `$subUnitId` },
          itemButtonList: { $first: `$itemButtonList` },
          roomDoorList: { $first: `$roomDoorList` },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

deleteImage3d = async (req, res, id) => {
  image3dModel.defaultSchema
    .findOneAndDelete({
      _id: id,
    })
    .then(function (data) {
      console.log(data);
      handleFiles.deleteFileCb(data.url, (cb) => {
        if (cb.done) {
          res.status(200).send(cb.msg);
        } else {
          res.status(400).send(cb.msg);
        }
      });
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteImage3d,
  updateImage3d: image3dModel.genericSchema.update,
  findById: image3dModel.genericSchema.findById,
  create: image3dModel.genericSchema.create,
  findAll,
};
