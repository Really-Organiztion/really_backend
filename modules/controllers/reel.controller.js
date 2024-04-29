const reelService = require("../services/reel.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    reelService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    reelService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    reelService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateReel = (req, res) => {
  try {
    const id = req.params.id;
    reelService.updateReel(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteReel = (req, res) => {
  try {
    const id = req.params.id;
    reelService.deleteReel(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

deleteReturn = (req, res) => {
  try {
    const id = req.params.id;
    reelService.deleteReturn(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateReel,
  deleteReel,
  deleteReturn,
};
