const crypto = require("crypto");
const paymentService = require("../services/payment.service");
const logger = require("../../helpers/logging");
const WE_ACCEPT_HMAC_KEY =
  process.env.WE_ACCEPT_HMAC_KEY || "2F5DFBDE6CFADACEDF01BEB1D9C98BB9";

generatePaymentKeyWithOrderRegistration = (req, res) => {
  try {
    paymentService.authenticate(req, res);
  } catch (error) {
    logger.error("An error occurred in /payments/key");
    logger.error(error);
  }
};

notificationCallback = (req, res) => {
  try {
    const type = req.body.type;
    const payload = req.body.obj;
    if (getCalculatedHmac(flatten(payload)) != req.query.hmac) {
      res.sendStatus(401);
    } else {
      paymentService.notificationCallback(type, payload, res);
    }
  } catch (error) {
    logger.error("An error occurred in /payments/notification-callback");
    logger.error(error);
  }
};

responseCallback = (req, res) => {
  try {
    const queryParams = req.query;
    if (getCalculatedHmac(queryParams) != req.query.hmac) {
      res.sendStatus(401);
    } else {
      paymentService.responseCallback(queryParams, res);
    }
  } catch (error) {
    logger.error("An error occurred in /payments/response-callback");
    logger.error(error);
  }
};

getCalculatedHmac = (data) => {
  const value = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order",
    "order.id",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success",
  ]
    .sort((a, b) => a.localeCompare(b))
    .map((key) => data[key])
    .join("");

  const hmacValue = crypto
    .createHmac("SHA512", WE_ACCEPT_HMAC_KEY)
    .update(value)
    .digest("hex");
  return hmacValue;
};

flatten = (obj, includePrototype, into, prefix) => {
  into = into || {};
  prefix = prefix || "";

  for (var k in obj) {
    if (includePrototype || obj.hasOwnProperty(k)) {
      var prop = obj[k];
      if (
        prop &&
        typeof prop === "object" &&
        !(prop instanceof Date || prop instanceof RegExp)
      ) {
        flatten(prop, includePrototype, into, prefix + k + ".");
      } else {
        into[prefix + k] = prop;
      }
    }
  }

  return into;
};

module.exports = {
  generatePaymentKeyWithOrderRegistration,
  notificationCallback,
  responseCallback,
  getCalculatedHmac,
};
