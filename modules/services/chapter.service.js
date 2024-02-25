const chapterModel = require("../models/chapter.model");

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  chapterModel.defaultSchema
    .aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "_id",
          foreignField: "chapterId",
          as: "lessons",
        },
      },
      {
        $group: {
          _id: "$_id",
          courseId: { $first: "$courseId" },
          name: { $first: `$${toFound}` },
          lessons: { $first: "$lessons" },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};
create = (req, res) => {
  chapterModel.defaultSchema.create(req.body, function (err, result) {
    if (err) res.status(500).send(err);
    else res.status(201).send(result);
  });
};
deleteChapter = async (req, res, id) => {
  allAttachments = [];
};
module.exports = {
  deleteChapter: chapterModel.genericSchema.delete,
  updateChapter: chapterModel.genericSchema.update,
  findById: chapterModel.genericSchema.findById,
  create,
  findAll,
};
