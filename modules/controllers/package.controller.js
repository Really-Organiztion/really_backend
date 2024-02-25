
const packageService = require("../services/package.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    packageService.findAll(req, res, "default");
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
 
        packageService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    packageService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updatePackage = (req, res) => {
  try {
    const id = req.params.id;
    packageService.updatePackage(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deletePackage = (req, res) => {
  try {
    const id = req.params.id;
    packageService.deletePackage(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findAllPackagesWithOutExec = (req, res) => {
  try {
    return packageService.findAll(req, res, "other");
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updatePackage,
  deletePackage,
  findAllPackagesWithOutExec,
};
