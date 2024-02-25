const promoCodeModel = require("../models/promoCode.model");

findAll = (req, res, type) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    promoCodeModel.defaultSchema
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select({ __v: 0 })
      .sort({ date: -1 })
      .exec((err, data) => {
        if (err) res.status(500).send(err);
        else {
          if (type === "other") {
            resolve(data);
          } else {
            res.status(200).send(data);
          }
        }
      });
  });
};

findPromoValueByCode = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  promoCodeModel.defaultSchema
    .findOne({ promoCode: req.body.promoCode })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ value: 1, discount: 1 })
    .exec((err, data) => {
      if (err) res.status(500).send(err);
      else {
        if (data) res.status(200).send(data);
        else res.status(404).send("Not Found");
      }
    });
};

module.exports = {
  deletePromoCode: promoCodeModel.genericSchema.delete,
  updatePromoCode: promoCodeModel.genericSchema.update,
  findById: promoCodeModel.genericSchema.findById,
  create: promoCodeModel.genericSchema.create,
  findAll,
  findPromoValueByCode,
};
