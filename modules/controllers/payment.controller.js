const paymentService = require("../services/payment.service");

const initiatePayment = async (req, res) => {
  try {
    const { amount, referenceId, platform, metadata = {} } = req.body;

    const session = await paymentService.createPayment(platform, {
      amount,
      referenceId,
      metadata,
    });

    res.status(200).json(session);
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const callbackHandler = async (req, res) => {
  try {
    const { session_id, platform } = req.query;

    const details = await paymentService.getPaymentDetails(platform, session_id);

    // مثال: حفظ التفاصيل في قاعدة البيانات أو تنفيذ إجراءات معينة
    console.log("Session Details:", details);

    res.status(200).json({ message: "Payment handled", details });
  } catch (err) {
    console.error("Callback Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initiatePayment,
  callbackHandler,
};
