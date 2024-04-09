/**
 * CRON JOB
 * Meant to run every 2 minutes with expression "0/2 * * * *".
 * https://crontab.guru/#0/2_*_*_*_*
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { sendReactEmail } from "@server/services/sendReactEmail";
import { env } from "~/env.mjs";
import NewEventLeads, { type InProcessEventToShow } from "@emails/newEventLeads";
import { MAX_AMOUNT_OF_NEW_LEADS_ANNOUNCED_PER_CRON_EXECUTION } from "./cronConstants";
import { type UtmParams } from "@prisma/client";
import { getEventPriceDetails, getVenueClosestMarketDistance } from "@server/services/pricing";
dayjs.extend(utc);

export type CreateLeadPrices = {
  packageName: string;
  totalPriceForPartial: number;
  retailPrice: number;
  promotionalPrice: number;
};

type CreateLeadAnnouncement = {
  inProcessEvent: InProcessEventToShow;
  utmParams?: UtmParams;
  prices: CreateLeadPrices[];
};

const sendLeadEmail = async ({ inProcessEvent, utmParams, prices }: CreateLeadAnnouncement) =>
  await sendReactEmail({
    to: env.EMAIL_TO_INFO,
    from: env.EMAIL_FROM,
    subject: `New Event Lead - ${inProcessEvent.firstName}, ${inProcessEvent.lastName}`,
    Email: NewEventLeads,
    emailProps: {
      inProcessEvent,
      utmSource: utmParams?.utmSource ?? undefined,
      utmMedium: utmParams?.utmMedium ?? undefined,
      utmCampaign: utmParams?.utmCampaign ?? undefined,
      utmTerm: utmParams?.utmTerm ?? undefined,
      utmContent: utmParams?.utmContent ?? undefined,
      utmId: utmParams?.utmId ?? undefined,
      prices,
    },
  });

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return response.status(401).end("Unauthorized");
  }

  // 1st: get every new lead that hasn't been announced yet and has no changed since 10 minutes or more.
  const tenMinutesAgo = dayjs.utc().subtract(10, "minutes").toDate();
  const inProcessEvents = await prisma.inProcessEvent.findMany({
    where: {
      hasBeenAnnounced: false,
      updatedAt: {
        lte: tenMinutesAgo,
      },
      isCorporateEvent: false,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      eventDate: true,
      type: { select: { name: true } },
      city: true,
      states: { select: { name: true } },
      approximateBudget: true,
      packages: { select: { title: true, id: true } },
      message: true,
      createdAt: true,
      updatedAt: true,
      utmParams: true,
      totalPriceForPartialInCents: true,
      retailPriceInCents: true,
    },
    take: MAX_AMOUNT_OF_NEW_LEADS_ANNOUNCED_PER_CRON_EXECUTION, // Taking MAX_AMOUNT_OF_NEW_LEADS_ANNOUNCED_PER_CRON_EXECUTION as maximum for each cron job execution.
  });

  const allPackages = await prisma.package.findMany({ select: { id: true, title: true } });

  if (inProcessEvents.length === 0)
    return response.json({ success: true, message: "No new event leads announced" });

  const promises = inProcessEvents.map(async (inProcessEvent) => {
    // 2nd: Prepare the email sending to env.EMAIL_TO_INFO announcing each new lead.
    let prices: CreateLeadPrices[] = [];
    try {
      if (
        inProcessEvent.approximateBudget != null &&
        inProcessEvent.city &&
        inProcessEvent.states
      ) {
        const budget = inProcessEvent.approximateBudget;
        const { distance, market } = await getVenueClosestMarketDistance(
          `${inProcessEvent.city}, ${inProcessEvent.states.name}`,
        );
        const eventPackages = inProcessEvent.packages ? [inProcessEvent.packages] : allPackages;
        prices = eventPackages.map((eventPackage) => {
          const pricing = getEventPriceDetails(
            dayjs.utc(inProcessEvent.eventDate).format("YYYY-MM-DD"),
            budget,
            eventPackage.id,
            distance,
            market,
          );
          return {
            packageName: eventPackage.title,
            totalPriceForPartial: pricing.totalForPartialPaymentInCents / 100,
            retailPrice:
              (pricing.retailPriceInCents +
                pricing.travelFeeInCents +
                pricing.expeditedEventFeeInCents) /
              100,
            promotionalPrice:
              (pricing.promotionalPriceInCents +
                pricing.travelFeeInCents +
                pricing.expeditedEventFeeInCents) /
              100,
          };
        });
      }
    } catch (error) {
      // Most likely error in getVenueClosestMarketDistance meaning service is not available for the venue
    }
    // }
    const success = await sendLeadEmail({
      inProcessEvent,
      utmParams: inProcessEvent.utmParams ?? undefined,
      prices,
    });

    return { success, id: inProcessEvent.id };
  });

  // 3rd: Sending all the emails in parallel.
  const results = await Promise.all(promises);

  const newLeadsAnnounced = results.filter((result) => result.success).map((result) => result.id);

  // 4th: Update all the hasBeenAnnounced fields to true in one query. This is made to prevent future announcements of the same inProcessEvent.
  await prisma.inProcessEvent.updateMany({
    where: {
      id: { in: newLeadsAnnounced },
    },
    data: {
      hasBeenAnnounced: true,
    },
  });

  return response.json({
    success: true,
    newLeadsAnnounced,
  });
};

export default handler;
