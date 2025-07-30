const axios = require("axios");
const THAWANI_SECRET_KEY = process.env.IS_TEST === "true" ? process.env.THAWANI_TEST_SECRET_KEY : process.env.THAWANI_SECRET_KEY;
const buildRedirectUrl = (action, id) => {
  const domain =
    process.env.IS_TEST === "true"
      ? "reallybooking.web.app"
      : "reallybooking.com";

  return `https://${domain}/check-transaction?action=${action}&id=${id}`;
};

const createSession = async ({ amount, referenceId, metadata }) => {
  const response = await axios.post(
    "https://uatcheckout.thawani.om/api/v1/checkout/session",
    {
      client_reference_id: referenceId,
      mode: "payment",
      products: [
        {
          name: "Test Order",
          quantity: 1,
          unit_amount: amount * 100, // من ريال إلى بيسة
        },
      ],
      success_url: buildRedirectUrl("success", referenceId),
      cancel_url: buildRedirectUrl("cancel", referenceId),
      metadata: metadata || {},
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "thawani-api-key": THAWANI_SECRET_KEY,
      },
    }
  );
  console.log(response.data.data);
  const checkoutUrl = process.env.IS_TEST === "true" ? "uatcheckout" : "checkout";
  return {
    url: `https://${checkoutUrl}.thawani.om/pay/${response.data.data.session_id}?key=${THAWANI_SECRET_KEY}`,
    session_id: response.data.data.session_id,
    gateway: "thawani",
  };
};

const getSessionDetails = async (sessionId) => {
  const response = await axios.get(
    `${process.env.THAWANI_API_URL}/checkout/session/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${THAWANI_SECRET_KEY}`,
      },
    }
  );

  return response.data.data;
};

module.exports = {
  createSession,
  getSessionDetails,
};
