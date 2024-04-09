import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

import { FacebookPixel } from "@components/FacebookPixel";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
      </Head>
      <body>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        />
        <Main />
        <NextScript />

        <FacebookPixel />
        <Script
          id="adroll-adv"
          type="text/javascript"
          strategy="afterInteractive"
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
          {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:3822535,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      </body>
    </Html>
  );
}
