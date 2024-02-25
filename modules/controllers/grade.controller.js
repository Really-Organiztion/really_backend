const gradeService = require("../services/grade.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    gradeService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        gradeService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    gradeService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateGrade = (req, res) => {
  try {
    const id = req.params.id;
    gradeService.updateGrade(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteGrade = (req, res) => {
  try {
    const id = req.params.id;
    gradeService.deleteGrade(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findGradeByEducationSystem = (req, res) => {
  try {
    const educationSystemId = req.params.educationSystemId;
    gradeService.findGradeByEducationSystem(req, res, educationSystemId);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateGrade,
  deleteGrade,
  findGradeByEducationSystem,
};
