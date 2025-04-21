import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const tronsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export default tronsporter;
