const image3dService = require("../services/image3d.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    image3dService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    image3dService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    image3dService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateImage3d = (req, res) => {
  try {
    const id = req.params.id;
    image3dService.updateImage3d(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteImage3d = (req, res) => {
  try {
    const id = req.params.id;
    image3dService.deleteImage3d(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateImage3d,
  deleteImage3d,
};
