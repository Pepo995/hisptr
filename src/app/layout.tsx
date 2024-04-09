import Head from "next/head";
import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { env } from "~/env.mjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
      </Head>

      <body>{children}</body>
      <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </html>
  );
}
