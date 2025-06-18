const adminSettingModel = require("../models/adminSetting.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getOne = async (req, res) => {
  try {
    let adminSetting = await adminSettingModel.defaultSchema.findOne({});

    if (!adminSetting) {
      adminSetting = await adminSettingModel.defaultSchema.create({});
    }

    res.json(adminSetting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOneCb = async () => {
  let adminSetting = await adminSettingModel.defaultSchema.findOne({});
  if (!adminSetting) {
    adminSetting = await adminSettingModel.defaultSchema.create({});
  }
  return adminSetting;
};



const updateAdminSetting = async (req, res, id) => {
  try {
    const adminSetting = await adminSettingModel.defaultSchema.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    res.json(adminSetting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getOne,
  updateAdminSetting,
  getOneCb,
};
