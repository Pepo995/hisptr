/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { withSentryConfig } from "@sentry/nextjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import bundleAnalyzer from "@next/bundle-analyzer";
import { env } from "./src/env.mjs";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      }),
    );

    // return the modified config
    return config;
  },
  experimental: {
    nextScriptWorkers: true,
  },
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_S3_BUCKET_HOST ?? "",
      },
    ],
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: "/hipstr-array-plus", destination: "/array", permanent: true },
      { source: "/installments", destination: "/custom-events", permanent: true },
      { source: "/one-ridiculous-photo-booth-package", destination: "/halo", permanent: true },
      { source: "/photography", destination: "/social-photographer", permanent: true },
      { source: "/videography", destination: "/404", permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles:
        env.NEXT_PUBLIC_INVOICES_ENABLED !== "true"
          ? [
              {
                source: "/admin/invoices/:path*",
                destination: "/404",
              },
            ]
          : [],
      afterFiles: [
        {
          source: "/franchise",
          destination: "https://www.hipstrfranchise.com/",
        },
        {
          source: "/apply-now",
          destination: "https://www.hipstrfranchise.com/apply-now",
        },
        {
          source: "/blog",
          destination: "https://blog.bookhipstr.com",
        },
        {
          source: "/post/:slug",
          destination: "https://blog.bookhipstr.com/post/:slug",
        },
        {
          source: "/author/:slug",
          destination: "https://blog.bookhipstr.com/author/:slug",
        },
        {
          source: "/category/:slug",
          destination: "https://blog.bookhipstr.com/category/:slug",
        },
      ],
      fallback: [],
    };
  },
};

export default withSentryConfig(
  withBundleAnalyzer(config),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "bookhipstr",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
