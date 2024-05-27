const bookingService = require("../services/booking.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    bookingService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    bookingService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    bookingService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateBookingStatus = (req, res) => {
  try {
    const id = req.params.id;
    bookingService.updateBookingStatus(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateBooking = (req, res) => {
  try {
    const id = req.params.id;
    bookingService.updateBooking(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteBooking = (req, res) => {
  try {
    const id = req.params.id;
    bookingService.deleteBooking(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
};
