// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a18f2e977918e6c3969cc70a2545a758@o4506405450022912.ingest.sentry.io/4506405451071488",
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});
