import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

import { env } from "~/env.mjs";

const productionTransport = () => {
  sgMail.setApiKey(env.SENDGRID_API_KEY!);
  return {
    sendMail: (msg: sgMail.MailDataRequired) => sgMail.send(msg),
  };
};

const developmentTransport = () =>
  nodemailer.createTransport({
    host: env.MAILHOG_HOST ?? "mailhog",
    port: env.MAILHOG_PORT ? Number(env.MAILHOG_PORT) : 1025,
    auth: {
      user: env.MAILHOG_USER ?? "user",
      pass: env.MAILHOG_PASS ?? "pass",
    },
  });

export const getTransport = () => {
  return env.SENDGRID_API_KEY ? productionTransport() : developmentTransport();
};
