import { paymentRouter } from "@server/api/routers/payment";
import { eventRouter } from "@server/api/routers/event";
import { addOnRouter } from "@server/api/routers/addOn";
import { marketRouter } from "@server/api/routers/market";
import { invoiceRouter } from "@server/api/routers/invoice";
import { priceRouter } from "@server/api/routers/price";
import { promotionalCodeRouter } from "@server/api/routers/promotionalCode";
import { usersRouter } from "@server/api/routers/user";
import { createTRPCRouter } from "@server/api/trpc";
import { authRouter } from "@server/api/routers/auth";
import { eventCustomerRouter } from "@server/api/routers/customer/events";
import { eventAdminRouter } from "./routers/admin/event";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  paymentRouter,
  eventRouter,
  addOnRouter,
  marketRouter,
  invoiceRouter,
  priceRouter,
  promotionalCodeRouter,
  authRouter,
  eventCustomerRouter,
  eventAdminRouter,
  usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
