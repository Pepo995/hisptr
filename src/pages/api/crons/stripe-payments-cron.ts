/**
 * CRON JOB
 * Meant to run every day at 05:00 with expression "0 5 * * *".
 * https://crontab.guru/#0_5_*_*_*
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@db";
import { makeSecondPayment } from "@server/services/payments";
import { type Event } from "@prisma/client";
import SecondPaymentFailed30Days from "@emails/secondPaymentFailed/30-days";
import SecondPaymentFailed20Days from "@emails/secondPaymentFailed/20-days";
import SecondPaymentFailed10Days from "@emails/secondPaymentFailed/10-days";
import SecondPaymentFailed5Days from "@emails/secondPaymentFailed/5-days";

const secondPaymentFixConfig = [
  {
    daysBefore: 30,
    subject: "[ACTION REQUIRED] Update your payment details for your upcoming Hipstr Event",
    email: SecondPaymentFailed30Days,
  },
  {
    daysBefore: 20,
    subject: "[ACTION REQUIRED] Payment Past Due for your Hipstr Event",
    email: SecondPaymentFailed20Days,
  },
  {
    daysBefore: 10,
    subject: "[ACTION REQUIRED] Payment Past Due for your Hipstr Event",
    email: SecondPaymentFailed10Days,
  },
  {
    daysBefore: 5,
    subject: "[ACTION REQUIRED] Payment Past Due for your Hipstr Event",
    email: SecondPaymentFailed5Days,
  },
];

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).end("Unauthorized");
  }

  // const thirtyDaysFromNow = new Date();
  // thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // 1st get every event that has to be paid.
  // const eventsToBePaid2 = await prisma.event.findMany({
  //   where: {
  //     paymentPlan: event_payment_plan.partial_50_50,
  //     eventDate: {
  //       lte: thirtyDaysFromNow,
  //     },
  //     adminStatus: events_admin_status.confirmed,
  //     amountPaidInCents: {
  //       lt:
  //         prisma.event.fields.totalPriceInCents -
  //         prisma.event.fields.promotionalCodeDiscountInCents,
  //     },
  //   },
  //   select: {
  //     totalPriceInCents: true,
  //     amountPaidInCents: true,
  //     discountInCents: true,
  //     promotionalCodeDiscountInCents: true,
  //     email: true,
  //     id: true,
  //     firstName: true,
  //     eventDate: true,
  //     firstPaymentDate: true,
  //   },
  // });

  // TODO Prevent getting the events already paid with promo code with the previous findMany instead of raw query when this condition can be made with findMany: amount_paid_in_cents < total_price_in_cents - promotionalCodeDiscountInCents.

  const cumulatedPromises = secondPaymentFixConfig.map(async (paymentMailConfig) => {
    const eventsToBePaid: Pick<
      Event,
      | "totalPriceInCents"
      | "amountPaidInCents"
      | "discountInCents"
      | "promotionalCodeDiscountInCents"
      | "email"
      | "id"
      | "firstName"
      | "eventDate"
      | "firstPaymentDate"
    >[] = await prisma.$queryRaw`
      SELECT id,
        email,
        discount_in_cents as discountInCents,
        event_date as eventDate,
        amount_paid_in_cents as amountPaidInCents,
        total_price_in_cents as totalPriceInCents,
        promotionalCodeDiscountInCents,
        first_name as firstName,
        firstPaymentDate
      FROM events
      WHERE payment_plan = 'partial_50_50'
        AND event_date = Date(DATE_ADD(NOW(), INTERVAL ${paymentMailConfig.daysBefore} DAY))
        AND admin_status = 'CONFIRMED'
        AND amount_paid_in_cents < total_price_in_cents - promotionalCodeDiscountInCents;
    `;

    const promises = eventsToBePaid.map((event) =>
      makeSecondPayment(
        event,
        paymentMailConfig.email,
        paymentMailConfig.subject,
        paymentMailConfig.daysBefore,
      ),
    );

    // 2nd make the payment for every event in the desired range.
    return await Promise.all(promises);
  });

  const promisesApplyingResult = await Promise.all(cumulatedPromises);

  return response.json({
    paymentResults: promisesApplyingResult,
  });
};

export default handler;
