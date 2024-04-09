import "../globals.css";
import MixpanelPageListener from "@components/MixpanelPageListener";
import { cookies } from "next/headers";
import Script from "next/script";
import Head from "next/head";

import { FacebookPixel } from "@components/FacebookPixel";
import ZendeskClient from "@components/ZendeskClient";
import UTMSetter from "@components/UTMSetter";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <FacebookPixel />

        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <meta name="robots" content="index, follow" />
      </Head>

      <body>
        {children}
        <MixpanelPageListener identifier={cookies().get("identifier")?.value} />
        <UTMSetter />
        <ZendeskClient />

        <Script
          id="adrollScript"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            adroll_adv_id = "XNY4Z3HASJHN3IKUEFKARQ";
            adroll_pix_id = "BHPXBGKMTJACPAF2LNLDWB";
            adroll_version = "2.0";
            (function(w, d, e, o, a) {
              w.__adroll_loaded = true;
              w.adroll = w.adroll || [];
              w.adroll.f = ['setProperties', 'identify', 'track' ];
              var roundtripUrl = "https://s.adroll.com/j/" + adroll_adv_id + "/roundtrip.js";
              for (a = 0; a < w.adroll.f.length; a++) {
                w.adroll[w.adroll.f[a]] = w.adroll[w.adroll.f[a]] || (function(n) { return function() { w.adroll.push([ n, arguments ]) } })(w.adroll.f[a])
              }
              e = d.createElement('script');
              o = d.getElementsByTagName('script')[0];
              e.async = 1;
              e.src = roundtripUrl;
              o.parentNode.insertBefore(e, o);
            })(window, document);
            adroll.track("pageView");
        `,
          }}
        />

        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:3822535,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}{" "}
        </Script>

        <Script type="application/ld+json" id="hipstr-script">{`{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "http://bookhipstr.com",
          "name": "Hipstr",
          "url": "https://www.bookhipstr.com",
          "logo": "https://bookhipstr.com/icon.png",
          "description": "Not an average photo booth rental; Hipstr is an experience. | New York, Los Angeles, Miami, Chicago, Boston, Denver, San Francisco, Dallas, Philadelphia & more",
          "sameAs": [
            "https://www.facebook.com/hipstrphotobooth",
            "https://www.instagram.com/bookhipstr"
          ]
        }`}</Script>
      </body>
    </html>
  );
}
