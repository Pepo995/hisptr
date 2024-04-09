import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@server/api/trpc";
import Stripe from "stripe";
import { Prisma, type PrismaClient, StripePaymentEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { parsePayment } from "@server/services/parsers";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const getStripeCustomerIdByEmail = async (prisma: PrismaClient, email: string) => {
  const customer = await prisma.stripeCustomer.findUnique({
    where: { email },
  });

  let customerId = customer?.stripeCustomerId;

  if (customerId === undefined) {
    const customer = await stripe.customers.create({
      description: `The customer ${email}`,
    });

    customerId = customer.id;

    await prisma.stripeCustomer.create({
      data: {
        email,
        stripeCustomerId: customerId,
      },
    });
  }
  return customerId;
};

export const paymentRouter = createTRPCRouter({
  savePayment: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
        email: z.string(),
        eventId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { paymentId, email, eventId } }) => {
      try {
        const customer = await ctx.prisma.stripeCustomer.findUnique({
          where: { email },
        });

        if (!customer) {
          // Creating customer in Stripe and in our DB if not exists.
          const customer = await stripe.customers.create({
            description: `The customer ${email}`,
          });

          const stripeCustomerId = customer.id;

          await ctx.prisma.stripeCustomer.create({
            data: {
              email,
              stripeCustomerId,
            },
          });
        }

        await ctx.prisma.stripePayment.create({
          data: {
            eventId,
            stripeCustomerEmail: email,
            paymentId,
            paymentStatus: StripePaymentEnum.succeeded,
          },
        });
        return true;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // Ignoring error if it's because the PK was duplicated.
          if (e.code === "P2002") return true;
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: e });
      }
    }),

  saveCard: publicProcedure
    .input(z.object({ setupIntentId: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input: { setupIntentId, email } }) => {
      // 1st: Creating customer in Stripe if it's not already created.
      const customerId = await getStripeCustomerIdByEmail(ctx.prisma, email);

      // 2nd: Creating setup intent.
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      // 3rd: Attaching payment method to customer.
      if (typeof setupIntent.payment_method !== "string")
        throw new Error("Error occurred, no payment method found");

      await stripe.paymentMethods.attach(setupIntent.payment_method, {
        customer: customerId,
      });

      await ctx.prisma.stripeSetupIntent.create({
        data: { stripeCustomerEmail: email, setupIntentId: setupIntent.id },
      });
      return true;
    }),

  getSetupIntent: publicProcedure.input(z.string().optional()).query(async () => {
    const setupIntent = await stripe.setupIntents.create();
    return {
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    };
  }),

  getEventPayments: publicProcedure.input(z.number()).query(async ({ ctx, input: eventId }) => {
    const payments = await ctx.prisma.stripePayment.findMany({
      where: { eventId },
    });

    return payments.map((payment) => parsePayment(payment));
  }),
});
