import { exportToCsv } from "@server/services/csv";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@db";
import { isValidToken } from "@server/services/security";
import { getWhereForInvoices } from "@utils/invoiceUtils";
import dayjs from "dayjs";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenReceived = request.query.token;

  if (!(await isValidToken(tokenReceived, "superadmin"))) {
    response.status(403);
    response.end("Invalid token");
    return;
  }

  const filter = request.query.filter ? (request.query.filter as string) : "";
  const tab = request.query.tab ? (request.query.tab as string) : "";
  const market = request.query.market ? (request.query.market as string) : "";

  const dateRangeFrom = request.query.dateRangeFrom ? (request.query.dateRangeFrom as string) : "";
  const dateRangeTo = request.query.dateRangeTo ? (request.query.dateRangeTo as string) : "";

  const formatedDateFrom = dayjs(dateRangeFrom).isValid()
    ? dayjs(dateRangeFrom).toDate()
    : undefined;
  const formatedDateTp = dayjs(dateRangeTo).isValid() ? dayjs(dateRangeTo).toDate() : undefined;

  const where = getWhereForInvoices(filter, market, formatedDateFrom, formatedDateTp);

  const invoices = await prisma.invoice.findMany({
    select: {
      id: true,
      pendingDueDate: true,
      invoiceDate: true,
      subtotalInCents: true,
      pendingInCents: true,
      invoiceType: true,
      event: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          eventDate: true,
          city: true,
          totalPriceInCents: true,
          discountInCents: true,
          amountPaidInCents: true,
          retailPriceInCents: true,
          promotionalCodeDiscountInCents: true,
          stripeFeeInCents: true,
          travelFeeInCents: true,
          packages: {
            select: {
              title: true,
            },
          },
          states: {
            select: {
              name: true,
            },
          },
        },
      },
      inProcessEvent: {
        select: {
          id: true,
          isCorporateEvent: true,
          marketName: true,
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where,
    orderBy: { id: "desc" },
  });

  let filteredInvoices = invoices;

  if (tab === "paid") {
    filteredInvoices = invoices.filter(
      ({ event }) =>
        event && event?.amountPaidInCents === event.totalPriceInCents - event.discountInCents,
    );
  }

  if (tab === "unpaid") {
    filteredInvoices = invoices.filter(
      ({ event }) =>
        event && event?.amountPaidInCents !== event?.totalPriceInCents - event?.discountInCents,
    );
  }

  exportToCsv(
    filteredInvoices.map((invoice) => ({
      ...invoice,
      firstName: invoice?.event?.firstName ?? null,
      lastName: invoice?.event?.firstName ?? null,
      packages: invoice?.event?.packages?.title ?? null,
      states: invoice?.event?.states?.name ?? null,
      type: invoice?.inProcessEvent?.type?.name ?? null,
      eventType: invoice?.inProcessEvent?.isCorporateEvent ? "Corporate" : "Social",
      isCorporateEvent: invoice.inProcessEvent?.isCorporateEvent,
      marketName: invoice.inProcessEvent?.marketName,
      event: invoice.event?.id ? (invoice.event?.id).toString() : null,
      inProcessEvent: invoice.inProcessEvent?.id ? invoice.inProcessEvent?.id : null,
    })),
    response,
    "invoice-list",
  );
};

export default handler;
