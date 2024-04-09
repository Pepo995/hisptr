"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { env } from "~/env.mjs";

async function identifyUser(identifier?: string) {
  try {
    const userIdentifier = identifier ?? (await fetch("/api/identify"));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    (window as any).mixpanel?.identify(userIdentifier);
  } catch (e) {
    console.error(e);
  }
}

export default function MixpanelPageListener({ identifier }: { identifier?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_MIXPANEL_TOKEN) return;
    if (typeof window === "undefined") return;

    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      if ((window as any).mixpanel === undefined) return;

      void (async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        if ((window as any).mixpanel.track === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
          (window as any).mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN);
        }

        await identifyUser(identifier);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        (window as any).mixpanel?.track("Page view", {
          url: pathname,
        });
      })();
    }, 500);
  }, [pathname, searchParams, identifier]);

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */}
      {typeof window != "undefined" && !(window as any).mixpanel && (
        <Script strategy="worker" id="mixpanelScript" src="/mixpanelinit.js" />
      )}
    </>
  );
}
