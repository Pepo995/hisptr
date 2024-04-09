'use client'

import { type UtmParams } from '@prisma/client';
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type Nullable<T> = { [K in keyof T]: T[K] | null };

type SetURMParams = Nullable<Partial<Omit<UtmParams, "id">>>;

async function setUTMParams(utmParams: SetURMParams) {
  try {
    for (const key in utmParams) {
      if (utmParams[key as keyof SetURMParams] === null) {
        delete utmParams[key as keyof SetURMParams];
      }
    }

    const searchParams = new URLSearchParams(utmParams as Record<string, string>);
    await fetch('/api/utm?' + searchParams.toString());
  } catch (e) {
    console.log(e)
  }
}

export default function UTMSetter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    void (async () => {
      const utmParms = {
        utmSource: searchParams?.get("utm_source") ?? document.referrer,
        utmMedium: searchParams?.get("utm_medium"),
        utmCampaign: searchParams?.get("utm_campaign"),
        utmTerm: searchParams?.get("utm_term"),
        utmContent: searchParams?.get("utm_content"),
        utmId: searchParams?.get("utm_id"),
      };

      await setUTMParams(utmParms);
    })()
  }, [pathname, searchParams]);

  return null;
}
