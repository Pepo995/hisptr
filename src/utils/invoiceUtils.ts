export const getWhereForInvoices = (
  filter?: string,
  market?: string,
  dateFrom?: Date,
  dateTo?: Date,
) => ({
  inProcessEvent: {
    marketName: { contains: market ?? "" },
  },
  invoiceDate: {
    ...(dateFrom && dateTo
      ? {
          gte: dateFrom,
          lte: dateTo,
        }
      : {}),
  },

  event: {
    OR: [
      { firstName: { contains: filter ?? "" } },
      { lastName: { contains: filter ?? "" } },
      { email: { contains: filter ?? "" } },
      { city: { contains: filter ?? "" } },
      { states: { name: { contains: filter ?? "" } } },
      { packages: { title: { contains: filter ?? "" } } },
    ],
  },
});
