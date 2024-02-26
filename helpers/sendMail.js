const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILPASS,
    },
  })
);

module.exports = {
  transporter,
};
