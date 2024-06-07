const bookingService = require("../services/booking.service");
const transactionController = require("../controllers/transaction.controller");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    bookingService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    transactionController.createTransaction(
      { body: req.body.transactionPayment },
      (errPayment, transactionPayment) => {
        if (errPayment) {
          res.status(400).send(errPayment);
        } else {
          transactionController.createTransaction(
            { body: req.body.transactionRecive },
            (errReceive, transactionReceive) => {
              if (errReceive) {
                res.status(400).send(errReceive);
              } else {
         
                bookingService.create( { body: req.body.booking }, res);
              }
            }
          );
        }
      }
    );
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
