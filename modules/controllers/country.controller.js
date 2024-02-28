const countryService = require("../services/country.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    countryService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        countryService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    countryService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCountry = (req, res) => {
  try {
    const id = req.params.id;
    countryService.updateCountry(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteCountry = (req, res) => {
  try {
    const id = req.params.id;
    countryService.deleteCountry(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateCountry,
  deleteCountry,
};
