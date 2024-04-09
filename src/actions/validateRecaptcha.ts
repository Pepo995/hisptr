"use server";
import axios from "axios";
import { env } from "~/env.mjs";

const secretKey = env.RECAPTCHA_SECRET_KEY;

const baseUrl = env.GOOGLE_RECAPTCHA_POST_URL;

export async function validateRecaptcha(captchaToken: string) {
  return await axios
    .post(`${baseUrl}?secret=${secretKey}&response=${captchaToken}`)
    .then((response) => {
      if (response.status === 200) {
        return { status: "success" };
      } else {
        return { status: "error", message: "reCAPTCHA verification failed" };
      }
    })
    .catch((error) => {
      console.error(error);
      return { status: "error", message: String(error) };
    });
}
