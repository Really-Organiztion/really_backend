const thawani = require("../../config/thawani");

const gateways = {
  thawani,
};

const createPayment = async (platform, params) => {
  const gateway = gateways[platform];
  if (!gateway) throw new Error("Unsupported payment platform");

  return await gateway.createSession(params);
};

const getPaymentDetails = async (platform, sessionId) => {
  const gateway = gateways[platform];
  if (!gateway) throw new Error("Unsupported payment platform");

  return await gateway.getSessionDetails(sessionId);
};

module.exports = {
  createPayment,
  getPaymentDetails,
};
