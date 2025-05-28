const bookingService = require("../services/booking.service");
const transactionController = require("../controllers/transaction.controller");
const logger = require("../../helpers/logging");
const mongoose = require('mongoose');

getAllData = (req, res) => {
  try {
    bookingService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

getAllDataPrivate = (req, res) => {
  try {
    bookingService.findAllPrivate(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionPayment = await transactionController.createTransaction(
      { body: req.body.transactionPayment },
      session
    );

    const transactionReceive = await transactionController.createTransaction(
      { body: req.body.transactionRecive },
      session
    );

    const booking = await bookingService.create(
      { body: req.body.booking },
      session
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ transactionPayment, transactionReceive, booking });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error(error);
    res.status(400).send({ error: error.message });
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
updateReceiptStatus = (req, res) => {
  try {
    const id = req.params.id;
    const type = req.params.type;
    bookingService.updateReceiptStatus(req, res, type, id);
  } catch (error) {
    logger.error(error);
  }
};
// updateReceiptStatus = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const type = req.params.type;
//     const status = req.body.status;

//     const cb = await bookingService.updateReceiptStatus(id,type,status );
    
//     if(cb.result) {
//       res.status(200).send(cb.result);
//     } else {
//       res.status(400).send(cb.err);
      
//     }
//   } catch (error) {
//     logger.error(error);
//   }
// };
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
  getAllDataPrivate,
  create,
  findById,
  updateBookingStatus,
  updateReceiptStatus,
  updateBooking,
  deleteBooking,
};
