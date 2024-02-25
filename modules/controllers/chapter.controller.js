const chapterService = require("../services/chapter.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    chapterService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        chapterService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    chapterService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateChapter = (req, res) => {
  try {
    const id = req.params.id;
    chapterService.updateChapter(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteChapter = (req, res) => {
  try {
    const id = req.params.id;
    chapterService.deleteChapter(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateChapter,
  deleteChapter,
};
