const educationSystemModel = require("../models/educationSystem.model");

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  educationSystemModel.defaultSchema
    .aggregate([
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};

module.exports = {
  deleteEducationSystem: educationSystemModel.genericSchema.delete,
  updateEducationSystem: educationSystemModel.genericSchema.update,
  findById: educationSystemModel.genericSchema.findById,
  create: educationSystemModel.genericSchema.create,
  findAll,
};
