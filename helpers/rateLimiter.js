const rateLimit = require("express-rate-limit");

const ipBanMap = new Map();

const banDurationMs = 5 * 60 * 1000;
const maxRequests = 150;
const windowMs = 5 * 60 * 1000;

function checkIpBan(req, res, next) {
  const ip = req.ip;
  const bannedUntil = ipBanMap.get(ip);

  if (bannedUntil && Date.now() < bannedUntil) {
    return res.status(429).json({ error: "Your IP is temporarily banned due to excessive requests." });
  }

  next();
}

const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  handler: (req, res) => {
    const ip = req.ip;
    ipBanMap.set(ip, Date.now() + banDurationMs);
    return res.status(429).json({
      error: "Too many requests. You are temporarily banned.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
  checkIpBan,
};
