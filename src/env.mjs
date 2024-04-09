import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    MIXPANEL_TOKEN: z.string().optional(),
    EMAIL_FROM: z.string(),
    EMAIL_TO_ADMIN: z.string(),
    EMAIL_TO_INFO: z.string(),
    EMAIL_TO_INFO_LEAD: z.string(),
    SECOND_PAYMENT_BCC: z.string().optional(),
    SUPPORT_MAIL: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    GOOGLE_MAPS_API_KEY: z.string(),
    SENDGRID_API_KEY: z.string().optional(),
    MAILHOG_HOST: z.string().optional(),
    MAILHOG_PORT: z.string().optional(),
    MAILHOG_USER: z.string().optional(),
    MAILHOG_PASS: z.string().optional(),
    AIR_TABLE_API_KEY: z.string(),
    AIR_TABLE_MARKETS_URL: z.string(),
    EMAIL_BCC: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    RECAPTCHA_SECRET_KEY: z.string(),
    GOOGLE_RECAPTCHA_POST_URL: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ZENDESK_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
    // Base name of react app
    NEXT_PUBLIC_BASENAME_URL: z.string(),
    NEXT_PUBLIC_VERCEL_URL: z.string(),
    NEXT_PUBLIC_API_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_API_VERSION: z.string().optional(),
    NEXT_PUBLIC_S3_BUCKET_HOST: z.string(),

    // Encryption token
    NEXT_PUBLIC_API_ENCRYPTION_KEY: z.string().optional(),

    NEXT_PUBLIC_API_JOTFORM: z.string().optional(),
    NEXT_PUBLIC_JOTFORM_FORM_ID: z.string().optional(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string(),
    NEXT_PUBLIC_FAQ_WEBFLOW_URL: z.string().optional(),
    NEXT_PUBLIC_INVOICES_ENABLED: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    EMAIL_BCC: process.env.EMAIL_BCC,
    SECOND_PAYMENT_BCC: process.env.SECOND_PAYMENT_BCC,
    CRON_SECRET: process.env.CRON_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    MAILHOG_HOST: process.env.MAILHOG_HOST,
    MAILHOG_PORT: process.env.MAILHOG_PORT,
    MAILHOG_USER: process.env.MAILHOG_USER,
    MAILHOG_PASS: process.env.MAILHOG_PASS,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO_ADMIN: process.env.EMAIL_TO_ADMIN,
    EMAIL_TO_INFO: process.env.EMAIL_TO_INFO,
    EMAIL_TO_INFO_LEAD: process.env.EMAIL_TO_INFO,
    SUPPORT_MAIL: process.env.SUPPORT_MAIL,
    MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_ZENDESK_KEY: process.env.NEXT_PUBLIC_ZENDESK_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    AIR_TABLE_API_KEY: process.env.AIR_TABLE_API_KEY,
    AIR_TABLE_MARKETS_URL: process.env.AIR_TABLE_MARKETS_URL,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,

    // Base Url of test server
    NEXT_PUBLIC_BASENAME_URL: process.env.NEXT_PUBLIC_BASENAME_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_BASENAME_URL,
    // API BASE URL & version
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    NEXT_PUBLIC_S3_BUCKET_HOST: process.env.NEXT_PUBLIC_S3_BUCKET_HOST,

    // Encryption token
    NEXT_PUBLIC_API_ENCRYPTION_KEY: process.env.NEXT_PUBLIC_API_ENCRYPTION_KEY,

    NEXT_PUBLIC_API_JOTFORM: process.env.NEXT_PUBLIC_API_JOTFORM,
    NEXT_PUBLIC_JOTFORM_FORM_ID: process.env.NEXT_PUBLIC_JOTFORM_FORM_ID,

    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

    GOOGLE_RECAPTCHA_POST_URL: process.env.GOOGLE_RECAPTCHA_POST_URL,
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_FAQ_WEBFLOW_URL: process.env.NEXT_PUBLIC_FAQ_WEBFLOW_URL,
    NEXT_PUBLIC_INVOICES_ENABLED: process.env.NEXT_PUBLIC_INVOICES_ENABLED,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR: z.string(),
   */
  emptyStringAsUndefined: true,
});
