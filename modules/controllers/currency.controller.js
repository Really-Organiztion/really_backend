const currencyService = require("../services/currency.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    currencyService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        currencyService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    currencyService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCurrency = (req, res) => {
  try {
    const id = req.params.id;
    currencyService.updateCurrency(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteCurrency = (req, res) => {
  try {
    const id = req.params.id;
    currencyService.deleteCurrency(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findCurrencyByEducationSystem = (req, res) => {
  try {
    const educationSystemId = req.params.educationSystemId;
    currencyService.findCurrencyByEducationSystem(req, res, educationSystemId);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateCurrency,
  deleteCurrency,
  findCurrencyByEducationSystem,
};
