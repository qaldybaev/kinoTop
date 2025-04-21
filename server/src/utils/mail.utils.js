import { config } from "dotenv";
import tronsporter from "../config/mail.config.js";
import { BaseException } from "../exception/base.exception.js";

config();

export const sendMail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const mail = await tronsporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });

    return mail.messageId;
  } catch (error) {
    throw new BaseException("Email yuborishda xatolik!");
  }
};
