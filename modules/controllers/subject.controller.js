const subjectService = require("../services/subject.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    subjectService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {

        subjectService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    subjectService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateSubject = (req, res) => {
  try {
    const id = req.params.id;
    subjectService.updateSubject(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteSubject = (req, res) => {
  try {
    const id = req.params.id;
    subjectService.deleteSubject(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findSubjectByEducationSystem = (req, res) => {
  try {
    const educationSystemId = req.params.educationSystemId;
    subjectService.findSubjectByEducationSystem(req, res, educationSystemId);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateSubject,
  deleteSubject,
  findSubjectByEducationSystem,
};
