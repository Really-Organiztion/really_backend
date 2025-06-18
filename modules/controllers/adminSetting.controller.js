const adminSettingService = require("../services/adminSetting.service");
const logger = require("../../helpers/logging");

getOne = (req, res) => {
  try {
    adminSettingService.getOne(req, res);
  } catch (error) {    
    logger.error(error);
  }
};

updateAdminSetting = (req, res) => {
  try {
    const id = req.params.id;
    adminSettingService.updateAdminSetting(req, res, id);
  } catch (error) {    
    logger.error(error);
  }
};

module.exports = {
  getOne,
  updateAdminSetting,
};
