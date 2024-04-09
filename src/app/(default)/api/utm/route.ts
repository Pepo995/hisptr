import { cookies } from "next/headers";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = cookies();

  const utmSource = searchParams?.get("utmSource");
  const utmMedium = searchParams?.get("utmMedium");
  const utmCampaign = searchParams?.get("utmCampaign");
  const utmTerm = searchParams?.get("utmTerm");
  const utmContent = searchParams?.get("utmContent");
  const utmId = searchParams?.get("utmId");

  if (utmSource && !utmSource.includes("hipstr") && !utmSource.includes("hipster")) {
    cookieStore.set("utm_source", utmSource);
  }
  if (utmMedium) {
    cookieStore.set("utm_medium", utmMedium);
  }
  if (utmCampaign) {
    cookieStore.set("utm_campaign", utmCampaign);
  }
  if (utmTerm) {
    cookieStore.set("utm_term", utmTerm);
  }
  if (utmContent) {
    cookieStore.set("utm_content", utmContent);
  }
  if (utmId) {
    cookieStore.set("utm_id", utmId);
  }

  return new Response(JSON.stringify({ utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId }));
}
