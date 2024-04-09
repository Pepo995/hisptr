// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { prisma } from "@server/db";

Sentry.init({
  dsn: "https://a18f2e977918e6c3969cc70a2545a758@o4506405450022912.ingest.sentry.io/4506405451071488",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.5,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [
    new Sentry.Integrations.Prisma({
      client: prisma,
    }),
  ],
});
