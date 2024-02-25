const axios = require("axios");
const paymentModel = require("../models/payment.model");
const WE_ACCEPT_PAYMENT_BASE_URL = "https://accept.paymobsolutions.com/api/";
const { v4: uuidv4 } = require("uuid");
const ACCEPT_INTEGRATION_ID = process.env.ACCEPT_INTEGRATION_ID || 200123;
const WE_ACCEPT_API_KEY =
  process.env.WE_ACCEPT_API_KEY ||
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsSWpvaU1UWXhOVGcwTnpNNU9DNDFOemd3TWpFaUxDSmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TnpjMk1UVjkucWcxNXNCZGctODVEZkwyRGJHUy1kUGNRU1J5XzU4aEFyTmk0bVlRRFNEWTNEVURTMmZxaHotQjZROXhnWWt4ZXd3SEdGbFpCeHZYOFg3NmRqMXBsZmc=";

authenticate = async (req, res) => {
  await axios
    .post(
      `${WE_ACCEPT_PAYMENT_BASE_URL}auth/tokens`,
      {
        api_key: WE_ACCEPT_API_KEY,
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => {
      if (response.data && response.data.token) {
        registerOrder(req, res, response.data.token, response.data.profile.id);
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({
        message: "Authentication failed.",
        error,
      });
    });
};

registerOrder = async (req, res, token, merchantId) => {
  await axios
    .post(
      `${WE_ACCEPT_PAYMENT_BASE_URL}ecommerce/orders`,
      {
        auth_token: token,
        delivery_needed: false,
        currency: "EGP",
        merchant_id: merchantId,
        amount_cents: req.body.estimatedCost * 100, // cost in the request is in EGP, gateway requires cost in cents (1 EGP = 100 piasters)
        merchant_order_id: uuidv4(),
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => {
      generatePaymentKeyWithOrderRegister(
        req,
        res,
        token,
        response.data.id,
        response.data.amount_cents,
        response.data.currency
      );
    })
    .catch((error) => {
      console.log(error);
      res.send({
        message: "Order registration failed.",
        error: JSON.stringify(error),
      });
    });
};
generatePaymentKeyWithOrderRegister = async (
  req,
  res,
  token,
  orderId,
  amountCents,
  currency
) => {
  await axios
    .post(
      `${WE_ACCEPT_PAYMENT_BASE_URL}acceptance/payment_keys`,
      {
        auth_token: token,
        amount_cents: amountCents,
        order_id: orderId,
        currency: currency,
        integration_id: ACCEPT_INTEGRATION_ID,
        billing_data: {
          apartment: "NA",
          email: req.body.email,
          floor: "NA",
          first_name: req.body.firstName,
          street: "NA",
          building: "NA",
          phone_number: req.body.phoneNumber,
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          last_name: req.body.lastName,
          state: "NA",
        },
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((response) => {
      res.send({ paymentKey: response.data.token });
    })
    .catch((error) => {
      console.log(error);
      res.send({
        message: "Payment key generation failed.",
        error: JSON.stringify(error),
      });
    });
};
notificationCallback = async (type, payload, res) => {
  if (payload.success) {
    const obj = {
      orderId: payload.order.merchant_order_id,
      type,
      createdAt: payload.created_at,
      payload,
    };
    await create(obj);
    if (type === "TRANSACTION" && payload.success) {
      console.log("aaaaaaaaaaaaa");
    } else {
      res.send("Received failed payment callback");
    }
  }
};

responseCallback = async (payload, res) => {
  if (payload.success === "true") {
    let obj = {
      approved: payload["data.message"],
      orderId: payload.order,
      merchantOrderId: payload.merchant_order_id,
    };
    res.status(200).send(obj);
  } else {
    res.status(406).send("Payment is not acceptable");
  }
};

create = async (obj) => {
  return new Promise((resolve, reject) => {
    paymentModel.defaultSchema.create(obj, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = {
  authenticate,
  notificationCallback,
  responseCallback,
};
