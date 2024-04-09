import sgMail from "@sendgrid/mail";
import { TRPCError } from "@trpc/server";

import nodemailer from "nodemailer";
import { env } from "~/env.mjs";

export type EmailMsg = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async (msg: EmailMsg) => {
  if (!env.SENDGRID_API_KEY) {
    const transporter = nodemailer.createTransport({
      host: env.MAILHOG_HOST ?? "mailhog",
      port: env.MAILHOG_PORT ? Number(env.MAILHOG_PORT) : 1025,
      auth: {
        user: env.MAILHOG_USER ?? "user",
        pass: env.MAILHOG_PASS ?? "pass",
      },
    });

    await transporter.sendMail({
      ...msg,
    });
  } else {
    if (!env.SENDGRID_API_KEY)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Missing SENDGRID_API_KEY",
      });
    sgMail.setApiKey(env.SENDGRID_API_KEY);

    try {
      await sgMail.send({
        ...msg,
        bcc: env.EMAIL_BCC,
      });
    } catch (e) {
      const error = e as {
        response: { body: { errors: { message: string }[] } };
      };

      console.error("error---->", error);
      console.error("errors---->", error.response.body.errors);
    }
  }
};
