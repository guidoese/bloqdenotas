import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

const mailer_transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});
export default mailer_transporter;
