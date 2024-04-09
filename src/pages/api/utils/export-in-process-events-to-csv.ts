import { exportToCsv } from "@server/services/csv";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@db";
import { getWhereForInProcessEvents } from "@utils/eventUtils";
import { isValidToken } from "@server/services/security";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenReceived = request.query.token;

  if (!(await isValidToken(tokenReceived, "superadmin"))) {
    response.status(403);
    response.end("Invalid token");
    return;
  }

  const filter = request.query.filter as string;
  const where = getWhereForInProcessEvents(filter !== "undefined" ? filter : undefined);

  const events = await prisma.inProcessEvent.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      message: true,
      marketName: true,

      eventDate: true,
      city: true,
      states: {
        select: {
          name: true,
        },
      },
      approximateBudget: true,
      budgetForPrice: true,
      packages: {
        select: {
          title: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },

      receiveCommunicationsAccepted: true,

      paymentPlan: true,
      totalPriceForFullInCents: true,
      stripeFeeForFullInCents: true,
      totalPriceForPartialInCents: true,
      stripeFeeForPartialInCents: true,
      discountInCents: true,
      travelFeeInCents: true,
      retailPriceInCents: true,

      hasBeenAnnounced: true,
      isCorporateEvent: true,

      createdAt: true,
      updatedAt: true,

      isActive: true,

      utmParams: true,
      event: true,
    },
    where,
    orderBy: { eventDate: "desc" },
  });

  exportToCsv(
    events.map((event) => ({
      ...event,
      city: event.city,
      packages: event.packages?.title ?? null,
      states: event.states?.name ?? null,
      type: event.type?.name ?? null,
      utmParams: event.utmParams?.utmSource ?? null,
      event: event.event?.id ? (event.event?.id).toString() : null,
    })),
    response,
    "unpaid-events",
  );
};

export default handler;
