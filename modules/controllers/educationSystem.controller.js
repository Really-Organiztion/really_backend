const educationSystemService = require("../services/educationSystem.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    educationSystemService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
 
          educationSystemService.create(req, res);
     
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    educationSystemService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateEducationSystem = (req, res) => {
  try {
    const id = req.params.id;
    educationSystemService.updateEducationSystem(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteEducationSystem = (req, res) => {
  try {
    const id = req.params.id;
    educationSystemService.deleteEducationSystem(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateEducationSystem,
  deleteEducationSystem,
};
