import { createTRPCRouter, publicProcedure } from "@server/api/trpc";
import {
  createCorporateInProcessEventSchema,
  createCustomLeadSchema,
  newEventSchema,
  payCorporateEventSchema,
  saveEventContactUsSchema,
  saveEventStep1Schema,
  saveEventStep2Schema,
  saveEventStep3Schema,
} from "@schemas";
import axios, { type AxiosRequestConfig } from "axios";
import Stripe from "stripe";
import {
  type InProcessEvent,
  type PromotionalCode,
  type StripeCustomer,
  type StripeSetupIntent,
  event_payment_plan,
  events_admin_status,
  invoice_type,
} from "@prisma/client";
import { getEventPriceDetails, getVenueClosestMarketDistance } from "@server/services/pricing";
import { HOLD_PERCENTAGE } from "@constants/pricing";
import { Config } from "@configs/Config";
import moment from "moment";
import { z } from "zod";
import { sendEmail } from "@server/services/emails";
import { corporateEventRequestConfirmationContent } from "@server/templates/corporateEventRequestConfirmation";
import { TRPCError } from "@trpc/server";
import { trackEvent } from "@server/services/mixpanel";
import { env } from "~/env.mjs";
import dayjs from "dayjs";
import { sendReactEmail } from "@server/services/sendReactEmail";
import Invoice from "@emails/invoice";
import EventConfirmation from "@emails/eventConfirmation";
import { PACKAGE_ID_360, PACKAGE_ID_ARRAY, PACKAGE_ID_HALO } from "@constants/packages";
import ConfirmAvailability from "@emails/confirmAvailabilty";
import { parseEvent } from "@server/services/parsers";
import { validateRecaptcha } from "~/actions/validateRecaptcha";
import { getWhereForInProcessEvents } from "@utils/eventUtils";
import EventCreation from "@emails/eventCreation";

import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";

import { eventCreate } from "@configs/ApiEndpoints";
import { generateReceiptNumber, getSubtotalInCents } from "@server/services/invoiceCreator";
import { getInvoiceInfo } from "@server/services/invoiceCreator";
import { randomBytes } from "crypto";
import NewContactUsSubmission from "@emails/newContactUsSumbission";
import { getMarketNameFromCityAndState } from "@server/services/markets";
dayjs.extend(advancedFormat);
dayjs.extend(utc);

const getPromotionalCodeDiscountInCents = (
  promotionalCodeInfo: PromotionalCode,
  inProcessEvent: InProcessEvent,
) => {
  if (!promotionalCodeInfo.isPercentage) return promotionalCodeInfo.discount;

  // Calculating subtotal using full payment and full payment's fees is the same as using partial payment and partial payment's fees.
  const subtotalInCents = getSubtotalInCents({
    totalPriceInCents: inProcessEvent.totalPriceForFullInCents,
    stripeFeeInCents: inProcessEvent.stripeFeeForFullInCents,
    travelFeeInCents: inProcessEvent.travelFeeInCents,
  });

  return subtotalInCents * (promotionalCodeInfo.discount / 100);
};

const getRestoredPriceFields = (priceShouldBeRestored: boolean, event: InProcessEvent) => ({
  totalPriceForFullInCents: priceShouldBeRestored ? 0 : event.totalPriceForFullInCents,
  stripeFeeForFullInCents: priceShouldBeRestored ? 0 : event.stripeFeeForFullInCents,
  totalPriceForPartialInCents: priceShouldBeRestored ? 0 : event.totalPriceForPartialInCents,
  stripeFeeForPartialInCents: priceShouldBeRestored ? 0 : event.stripeFeeForPartialInCents,
  discountInCents: priceShouldBeRestored ? 0 : event.discountInCents,
  travelFeeInCents: priceShouldBeRestored ? 0 : event.travelFeeInCents,
  retailPriceInCents: priceShouldBeRestored ? 0 : event.retailPriceInCents,
});

export const eventRouter = createTRPCRouter({
  getInProcessEvent: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        requirePrice: z.boolean().default(false),
        requirePackagesPrices: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input: { id, requirePrice, requirePackagesPrices } }) => {
      if (!id)
        return {
          success: false,
        };

      const event = await ctx.prisma.inProcessEvent.findUnique({
        where: {
          id,
        },
        include: {
          states: true,
          type: true,
          event: {
            select: {
              addOns: {
                include: {
                  addOn: true,
                },
              },
            },
          },
        },
      });

      if (!event)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      let packageOptions;

      if (requirePackagesPrices) {
        if (
          !event.eventDate ||
          !event.city ||
          !event.states?.name ||
          event.budgetForPrice === null
        ) {
          return {
            success: false,
            message:
              "Missing event info to calculate the price, please go through every step and try again",
          };
        }
        //TODO:
        // CALL ONCE WHEN WE ARE USING IT IN OUT DATABASE INSTEAD OF AIRTABLE
        const { distance, market } = await getVenueClosestMarketDistance(
          getMarketNameFromCityAndState(event.city, event.states.name),
        );

        const HaloPrice = getEventPriceDetails(
          moment.utc(event.eventDate).format("YYYY-MM-DD"),
          event.budgetForPrice,
          PACKAGE_ID_HALO,
          distance,
          market,
        );

        const ThreeSixtyPrice = getEventPriceDetails(
          moment.utc(event.eventDate).format("YYYY-MM-DD"),
          event.budgetForPrice,
          PACKAGE_ID_360,
          distance,
          market,
        );

        const ArrayPrice = getEventPriceDetails(
          moment.utc(event.eventDate).format("YYYY-MM-DD"),
          event.budgetForPrice,
          PACKAGE_ID_ARRAY,
          distance,
          market,
        );

        packageOptions = [
          {
            id: PACKAGE_ID_HALO,
            price: HaloPrice.totalForPartialPaymentInCents / 100,
          },
          {
            id: PACKAGE_ID_360,
            price: ThreeSixtyPrice.totalForPartialPaymentInCents / 100,
          },
          {
            id: PACKAGE_ID_ARRAY,
            price: ArrayPrice.totalForPartialPaymentInCents / 100,
          },
        ];
      }

      if (requirePrice) {
        if (
          !event.eventDate ||
          !event.city ||
          !event.states?.name ||
          event.budgetForPrice === null ||
          event.packageId === null
        ) {
          return {
            success: false,
            message:
              "Missing event info to calculate the price, please go through every step and try again",
          };
        }

        // Calculating the totalPriceForFullInCents and stripeFeeForFullInCents if any of them is missing.
        if (!event.totalPriceForFullInCents || !event.stripeFeeForFullInCents) {
          try {
            const { distance, market } = await getVenueClosestMarketDistance(
              getMarketNameFromCityAndState(event.city, event.states.name),
            );
            const price = getEventPriceDetails(
              moment.utc(event.eventDate).format("YYYY-MM-DD"),
              event.budgetForPrice,
              event.packageId,
              distance,
              market,
            );

            event.totalPriceForFullInCents = price.totalForFullPaymentInCents;
            event.stripeFeeForFullInCents = price.stripeFeeForFullPaymentInCents;
            event.totalPriceForPartialInCents = price.totalForPartialPaymentInCents;
            event.stripeFeeForPartialInCents = price.stripeFeeForPartialPaymentInCents;
            event.discountInCents = price.discountInFullPriceAndMoreThan60Days;
            event.travelFeeInCents = price.travelFeeInCents;
            event.retailPriceInCents = price.retailPriceInCents;

            await ctx.prisma.inProcessEvent.update({
              where: {
                id,
              },
              data: {
                totalPriceForFullInCents: price.totalForFullPaymentInCents,
                stripeFeeForFullInCents: price.stripeFeeForFullPaymentInCents,
                totalPriceForPartialInCents: price.totalForPartialPaymentInCents,
                stripeFeeForPartialInCents: price.stripeFeeForPartialPaymentInCents,
                discountInCents: price.discountInFullPriceAndMoreThan60Days,
                travelFeeInCents: price.travelFeeInCents,
                retailPriceInCents: price.retailPriceInCents,
                marketName: price.marketName,
              },
            });
          } catch (e) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: (e as Error).message ?? "Error getting event price, please retry later",
              cause: e,
            });
          }
        }
      }

      return {
        success: true,
        event,
        packageOptions,
      };
    }),
  getCorporateInProcessEvents: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.prisma.inProcessEvent.findMany({
      where: {
        isCorporateEvent: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        eventDate: true,
      },
      orderBy: {
        eventDate: "desc",
      },
    });

    return {
      success: true,
      events,
    };
  }),

  getInProcessEvents: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
        filter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { page, pageSize, filter } }) => {
      const where = getWhereForInProcessEvents(filter);
      const eventsPromise = ctx.prisma.inProcessEvent.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          eventDate: "desc",
        },
        include: {
          states: true,
          packages: true,
          type: true,
          utmParams: true,
          event: true,
        },
      });

      const totalPromise = ctx.prisma.inProcessEvent.count({
        where,
      });

      const [events, total] = await Promise.all([eventsPromise, totalPromise]);

      return {
        success: true,
        events,
        total,
      };
    }),

  getInProcessEventsForEmail: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: email }) => {
      const events = await ctx.prisma.inProcessEvent.findMany({
        where: { email, eventDate: { gte: dayjs.utc().startOf("day").toDate() } },
        orderBy: {
          eventDate: "desc",
        },
        include: {
          states: true,
          packages: true,
          type: true,
        },
      });

      return {
        success: true,
        events,
      };
    }),

  getEvent: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id,
        },
      });

      if (!event)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });

      return {
        success: true,
        event: parseEvent(event),
      };
    }),

  saveEventStep1: publicProcedure
    .input(saveEventStep1Schema)
    .mutation(
      async ({
        ctx,
        input: {
          firstName,
          lastName,
          email,
          typeId,
          stateId,
          city,
          consent,
          eventId,
          captchaToken,
          clientId,
        },
      }) => {
        const [recaptchaResult, type, state] = await Promise.all([
          validateRecaptcha(captchaToken),
          ctx.prisma.eventPreference.findUnique({
            where: {
              id: typeId,
            },
          }),
          ctx.prisma.state.findUnique({
            where: {
              id: stateId,
            },
          }),
        ]);

        if (recaptchaResult?.status !== "success") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              typeof recaptchaResult.message === "string"
                ? recaptchaResult.message
                : "Error validating recaptcha",
          });
        }

        if (!eventId) {
          const utmSource = ctx.req?.cookies?.utm_source;
          const utmMedium = ctx.req?.cookies?.utm_medium;
          const utmCampaign = ctx.req?.cookies?.utm_campaign;
          const utmTerm = ctx.req?.cookies?.utm_term;
          const utmContent = ctx.req?.cookies?.utm_content;
          const utmId = ctx.req?.cookies?.utm_id;

          const utmParams = await ctx.prisma.utmParams.create({
            data: {
              utmSource,
              utmMedium,
              utmCampaign,
              utmTerm,
              utmContent,
              utmId,
              clientId,
            },
          });

          const event = await ctx.prisma.inProcessEvent.create({
            data: {
              firstName,
              lastName,
              email,
              typeId,
              city,
              stateId,
              receiveCommunicationsAccepted: consent,
              utmParamsId: utmParams.id,
            },
          });

          eventId = event.id;

          trackEvent({
            type: "Customer submitted Step 1",
            distinctId: ctx.req?.cookies?.identifier ?? event.id,
            clientName: `${firstName} ${lastName}`,
            properties: {
              ...event,
              eventType: type?.name,
              state: state?.name,
            },
          });
        } else {
          const event = await ctx.prisma.inProcessEvent.findUnique({
            where: {
              id: eventId,
            },
          });

          if (!event)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Event not found",
            });

          const priceShouldBeRestored = event.city !== city || event.stateId !== stateId;

          await ctx.prisma.inProcessEvent.update({
            where: {
              id: eventId,
            },
            data: {
              firstName,
              lastName,
              email,
              typeId,
              city,
              stateId,
              budgetForPrice: priceShouldBeRestored
                ? event.approximateBudget
                : event.budgetForPrice,
              receiveCommunicationsAccepted: consent,
              ...getRestoredPriceFields(priceShouldBeRestored, event),
            },
          });

          trackEvent({
            type: "Customer submitted Step 1",
            distinctId: ctx.req?.cookies?.identifier ?? event.id,
            clientName: `${firstName} ${lastName}`,
            properties: {
              ...event,
              eventType: type?.name,
              state: state?.name,
            },
          });
        }

        return {
          success: true,
          eventId,
          typeName: type?.name,
        };
      },
    ),

  saveEventStep2: publicProcedure
    .input(saveEventStep2Schema)
    .mutation(
      async ({ ctx, input: { eventDate, phoneNumber, approximateBudget, message, eventId } }) => {
        let event = await ctx.prisma.inProcessEvent.findUnique({
          where: {
            id: eventId,
          },
        });

        if (!event)
          return {
            success: false,
            message: "Event not found",
          };

        const date = dayjs.utc(eventDate).toDate();

        const priceShouldBeRestored = !dayjs.utc(event.eventDate).isSame(date);

        event = await ctx.prisma.inProcessEvent.update({
          where: {
            id: eventId,
          },
          data: {
            eventDate: date,
            phoneNumber,
            budgetForPrice: priceShouldBeRestored ? approximateBudget : event.budgetForPrice,
            approximateBudget,
            message,
            ...getRestoredPriceFields(priceShouldBeRestored, event),
          },
        });

        trackEvent({
          type: "Customer submitted Step 2",
          distinctId: ctx.req?.cookies?.identifier ?? event.id,
          properties: event,
        });

        return {
          success: true,
          event,
        };
      },
    ),

  saveEventStep3: publicProcedure
    .input(saveEventStep3Schema)
    .mutation(async ({ ctx, input: { packageId, eventId } }) => {
      const event = await ctx.prisma.inProcessEvent.findUnique({
        where: {
          id: eventId,
        },
        include: {
          states: true,
        },
      });
      const packageName =
        packageId === PACKAGE_ID_HALO ? "Halo" : packageId === PACKAGE_ID_ARRAY ? "Array" : "360";

      if (!event)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });

      if (!event.eventDate || !event.city || !event.states?.name || event.budgetForPrice === null) {
        return {
          success: false,
          message:
            "Missing event info to calculate the price, please go through every step and try again",
        };
      }

      try {
        const { distance, market } = await getVenueClosestMarketDistance(
          getMarketNameFromCityAndState(event.city, event.states.name),
        );
        const price = getEventPriceDetails(
          moment.utc(event.eventDate).format("YYYY-MM-DD"),
          event.budgetForPrice,
          packageId,
          distance,
          market,
        );

        event.totalPriceForFullInCents = price.totalForFullPaymentInCents;
        event.stripeFeeForFullInCents = price.stripeFeeForFullPaymentInCents;
        event.totalPriceForPartialInCents = price.totalForPartialPaymentInCents;
        event.stripeFeeForPartialInCents = price.stripeFeeForPartialPaymentInCents;
        event.discountInCents = price.discountInFullPriceAndMoreThan60Days;
        event.travelFeeInCents = price.travelFeeInCents;
        event.retailPriceInCents = price.retailPriceInCents;

        await ctx.prisma.inProcessEvent.update({
          where: {
            id: eventId,
          },
          data: {
            packageId,
            totalPriceForFullInCents: price.totalForFullPaymentInCents,
            stripeFeeForFullInCents: price.stripeFeeForFullPaymentInCents,
            totalPriceForPartialInCents: price.totalForPartialPaymentInCents,
            stripeFeeForPartialInCents: price.stripeFeeForPartialPaymentInCents,
            discountInCents: price.discountInFullPriceAndMoreThan60Days,
            travelFeeInCents: price.travelFeeInCents,
            retailPriceInCents: price.retailPriceInCents,
            marketName: price.marketName,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (e as Error).message ?? "Error getting event price, please retry later",
          cause: e,
        });
      }

      trackEvent({
        type: "Customer submitted Step 3",
        distinctId: ctx.req?.cookies?.identifier ?? event.id,
        properties: {
          ...event,
          packageName,
        },
      });

      return {
        success: true,
        event,
        packageName,
      };
    }),

  saveEventContactUs: publicProcedure
    .input(saveEventContactUsSchema)
    .mutation(
      async ({
        ctx,
        input: {
          firstName,
          lastName,
          eventDate,
          email,
          phoneNumber,
          city,
          stateId,
          budgetForPrice,
          packageId,
          typeId,
          message,
          consent,
          captchaToken,
          clientId,
        },
      }) => {
        const [recaptchaResult, type, state] = await Promise.all([
          validateRecaptcha(captchaToken),
          typeId
            ? ctx.prisma.eventPreference.findUnique({
                where: {
                  id: typeId,
                },
              })
            : null,
          stateId
            ? ctx.prisma.state.findUnique({
                where: {
                  id: stateId,
                },
              })
            : null,
        ]);

        if (recaptchaResult?.status !== "success") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              typeof recaptchaResult.message === "string"
                ? recaptchaResult.message
                : "Error validating recaptcha",
          });
        }

        const utmSource = ctx.req?.cookies?.utm_source;
        const utmMedium = ctx.req?.cookies?.utm_medium;
        const utmCampaign = ctx.req?.cookies?.utm_campaign;
        const utmTerm = ctx.req?.cookies?.utm_term;
        const utmContent = ctx.req?.cookies?.utm_content;

        const utmId = ctx.req?.cookies?.utm_id;

        const utmParams = await ctx.prisma.utmParams.create({
          data: {
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            utmId,
            clientId: clientId,
          },
        });

        const event = await ctx.prisma.inProcessEvent.create({
          include: {
            states: { select: { name: true } },
            packages: { select: { title: true } },
            type: { select: { name: true } },
          },
          data: {
            firstName,
            lastName,
            eventDate,
            email,
            phoneNumber,
            city,
            stateId,
            budgetForPrice,
            packageId,
            typeId,
            message,
            receiveCommunicationsAccepted: consent,
            bookingType: "contactUs",
            utmParamsId: utmParams.id,
          },
        });

        trackEvent({
          type: "Customer submitted Step 1",
          distinctId: ctx.req?.cookies?.identifier ?? event.id,
          clientName: `${firstName} ${lastName}`,
          properties: {
            ...event,
            eventType: type?.name,
            state: state?.name,
          },
        });

        const inProcessEventToShow = {
          firstName: event.firstName,
          lastName: event.lastName,
          phoneNumber: event.phoneNumber,
          email: event.email,
          eventDate: event.eventDate,
          city: event.city,
          approximateBudget: event.budgetForPrice,
          message: event.message,
          createdAt: new Date(),
          updatedAt: new Date(),
          states: event.states,
          packages: event.packages,
          type: event.type,
          receiveCommunications: event.receiveCommunicationsAccepted ?? false,
        };

        const contactUsData: Parameters<typeof NewContactUsSubmission>[0] = {
          inProcessEvent: inProcessEventToShow,
        };

        await sendReactEmail({
          to: env.EMAIL_TO_INFO,
          from: env.EMAIL_FROM,
          subject: `New Contact Us Submission - ${event.firstName} ${event.lastName}`,
          Email: NewContactUsSubmission,
          emailProps: contactUsData,
        });

        return {
          success: true,
          eventId: event.id,
          typeName: type?.name,
        };
      },
    ),

  createCorporateInProcessEvent: publicProcedure
    .input(createCorporateInProcessEventSchema)
    .mutation(
      async ({
        ctx,
        input: {
          firstName,
          lastName,
          email,
          typeId,
          stateId,
          city,
          consent,
          eventDate,
          phoneNumber,
          approximateBudget,
          captchaToken,
          clientId,
        },
      }) => {
        const date = new Date(eventDate);

        const recaptchaResult = await validateRecaptcha(captchaToken);

        if (recaptchaResult?.status !== "success") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          });
        }

        const utmSource = ctx.req?.cookies?.utm_source;
        const utmMedium = ctx.req?.cookies?.utm_medium;
        const utmCampaign = ctx.req?.cookies?.utm_campaign;
        const utmTerm = ctx.req?.cookies?.utm_term;
        const utmContent = ctx.req?.cookies?.utm_content;
        const utmId = ctx.req?.cookies?.utm_id;

        const utmParams = await ctx.prisma.utmParams.create({
          data: {
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            utmId,
            clientId,
          },
        });

        const event = await ctx.prisma.inProcessEvent.create({
          data: {
            firstName,
            lastName,
            email,
            typeId,
            city,
            stateId,
            receiveCommunicationsAccepted: consent,
            eventDate: date,
            phoneNumber,
            approximateBudget,
            isCorporateEvent: true,
            utmParamsId: utmParams.id,
          },
        });

        const state = await ctx.prisma.state.findUnique({
          where: {
            id: stateId,
          },
        });

        const type = await ctx.prisma.eventPreference.findUnique({
          where: {
            id: typeId,
          },
        });

        const customerName = `${event.firstName} ${event.lastName}`;

        trackEvent({
          type: "Customer created corporate event",
          distinctId: ctx.req?.cookies?.identifier ?? event.id,
          clientName: customerName,
          properties: event,
        });

        const formatedEventDate = event?.eventDate
          ? dayjs.utc(event?.eventDate).format("MM/DD/YYYY")
          : "";

        await sendReactEmail({
          to: env.EMAIL_TO_INFO,
          from: env.EMAIL_FROM,
          subject: `New Event Corporate - ${customerName} - ${formatedEventDate}`,
          Email: EventCreation,
          emailProps: {
            clientEmail: event.email,
            customerName,
            eventDate: formatedEventDate,
            packageId: event.packageId,
            budget: event.approximateBudget,
            city: event.city,
            state: state?.name ?? null,
            phoneNumber: event.phoneNumber,
            message: event.message,
            receiveCommunications: event.receiveCommunicationsAccepted,
            isCorporate: event.isCorporateEvent,
            price: null,
            eventNumber: null,
            eventType: type?.name ?? null,
            corporateLink: `${env.NEXT_PUBLIC_VERCEL_URL}/admin/invoice-for-corporate/${event.id}`,
          },
        });

        if (!event.email)
          return {
            success: false,
            message: "Event created successfully but the mail was not sent due to missing info",
          };

        const { text, html } = corporateEventRequestConfirmationContent(event.firstName);

        const subject = "Hipstr x Your Event!";

        await sendEmail(
          {
            to: event.email,
            from: env.EMAIL_FROM,
            subject,
            text,
            html,
          },
          // ["/files/Hipstr Capabilities Deck 2023.pdf"],
        );

        return {
          success: true,
          eventId: event.id,
          event,
          typeName: type?.name,
        };
      },
    ),

  createCustomLead: publicProcedure
    .input(createCustomLeadSchema)
    .mutation(
      async ({
        ctx,
        input: {
          firstName,
          lastName,
          email,
          stateId,
          city,
          eventDate,
          phoneNumber,
          approximateBudget,
        },
      }) => {
        const date = new Date(eventDate);

        const inProcessEvent = await ctx.prisma.inProcessEvent.create({
          data: {
            firstName,
            lastName,
            email,
            typeId: PACKAGE_ID_HALO,
            city,
            stateId,
            receiveCommunicationsAccepted: true,
            eventDate: date,
            phoneNumber,
            approximateBudget,
            isCorporateEvent: true,
            bookingType: "manuaInvoice",
          },
        });

        const type = await ctx.prisma.eventPreference.findUnique({
          where: {
            id: PACKAGE_ID_HALO,
          },
        });

        return {
          success: true,
          eventId: inProcessEvent.id,
          event: inProcessEvent,
          typeName: type?.name,
        };
      },
    ),

  payCorporateEvent: publicProcedure
    .input(payCorporateEventSchema)
    .mutation(async ({ ctx, input: { id, setupIntentId } }) => {
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-08-16",
      });

      const event = await ctx.prisma.event.findUnique({
        where: {
          id,
        },
        include: {
          states: true,
          eventPreferencesEventsTypeIdToeventPreferences: true,
        },
      });

      if (!event?.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing email in event",
        });

      // 1st: Creating customer in Stripe if it's not already created.
      let customer:
        | (StripeCustomer & {
            stripeSetupIntents?: StripeSetupIntent[];
          })
        | null = await ctx.prisma.stripeCustomer.findUnique({
        where: {
          email: event.email,
        },
        include: {
          stripeSetupIntents: true,
        },
      });

      if (!customer) {
        const stripeCustomer = await stripe.customers.create({
          description: `The customer ${event.email}`,
        });

        customer = await ctx.prisma.stripeCustomer.create({
          data: {
            email: event.email,
            stripeCustomerId: stripeCustomer.id,
          },
        });
      }

      const customerId = customer.stripeCustomerId;

      // 2nd: Retrieving setup intent.
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      if (typeof setupIntent.payment_method !== "string")
        throw new Error("Error occurred, no setup intent found");

      if (
        !customer?.stripeSetupIntents?.some(
          (existingSetupIntent) => existingSetupIntent.setupIntentId === setupIntent.id,
        )
      ) {
        // 3rd: Attaching payment method to customer.
        await stripe.paymentMethods.attach(setupIntent.payment_method, {
          customer: customerId,
        });

        await ctx.prisma.stripeSetupIntent.create({
          data: {
            stripeCustomerEmail: event.email,
            setupIntentId: setupIntent.id,
          },
        });
      }

      // 4th: Charge event price to customer.
      const paymentMethodId = setupIntent.payment_method;

      if (typeof paymentMethodId !== "string")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing payment method id",
        });

      const priceToChargeInCents =
        event.paymentPlan === event_payment_plan.full
          ? event.totalPriceInCents
          : Math.floor(event.totalPriceInCents * 0.5);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceToChargeInCents,
        confirm: true,
        currency: "usd",
        customer: customer.stripeCustomerId,
        payment_method: paymentMethodId,
        return_url: `${process.env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-paid`,
      });

      await ctx.prisma.stripePayment.create({
        data: {
          stripeCustomerEmail: customer.email,
          paymentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          amountInCents: paymentIntent.amount,
          date: new Date(paymentIntent.created * 1000),
          eventId: id,
        },
      });

      // 5th Update the event with the payment info.
      await ctx.prisma.event.update({
        where: {
          id,
        },
        data: {
          amountPaidInCents: priceToChargeInCents,
          adminStatus: events_admin_status.confirmed,
          firstPaymentDate: dayjs.utc().toDate(),
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (!event.eventPreferencesEventsTypeIdToeventPreferences || !event.states) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting event info",
        });
      }
      const type = event.eventPreferencesEventsTypeIdToeventPreferences;

      // 6th Send email to the customer.
      const completedBeforeDate = dayjs.utc(event.eventDate).subtract(30, "days").toDate();
      const finalCheckInDate = dayjs.utc(event.eventDate).subtract(14, "days").toDate();

      const subject = "[Action Required] Hipstr Event Confirmation + Next Steps";
      await sendReactEmail({
        to: event.email,
        from: env.EMAIL_FROM,
        subject,
        Email: EventConfirmation,
        emailProps: {
          ...event,
          date: new Date(event.eventDate),
          completedBeforeDate,
          finalCheckInDate,
          signUpToken: event.signUpToken,
        },
      });

      const promotionalCodeDiscountInCents = event.promotionalCodeDiscountInCents ?? 0;

      const { pendingDueDate, pendingInCents, subtotalInCents } = getInvoiceInfo(
        event,
        event.discountInCents,
        promotionalCodeDiscountInCents,
        priceToChargeInCents,
      );

      const invoice = await ctx.prisma.invoice.create({
        data: {
          invoiceType:
            event.paymentPlan === event_payment_plan.full
              ? invoice_type.final_balance
              : invoice_type.deposit,
          inProcessEventId: event.inProcessEventId ?? undefined,
          eventId: event.id,
          paymentId: paymentIntent.id,
          subtotalInCents,
          pendingInCents,
          pendingDueDate: pendingDueDate.toDate(),
        },
      });
      const receiptNumber = generateReceiptNumber(invoice.id);
      let receiptDate = dayjs.utc(invoice.invoiceDate);
      if (!receiptDate.isValid()) {
        receiptDate = dayjs.utc();
      }

      // TODO: Missing expedited events logic
      const invoiceData: Parameters<typeof Invoice>[0] = {
        ...event,
        receiptNumber,
        state: event.states.name,
        eventDate: dayjs.utc(event.eventDate).format("dddd MMMM D, YYYY"),
        eventType: type.name,
        subtotal: subtotalInCents / 100,
        retailPrice: event.retailPriceInCents / 100,
        total: (event.totalPriceInCents - event.discountInCents) / 100,
        promotionalCodeDiscount: promotionalCodeDiscountInCents / 100,
        pending: pendingInCents / 100,
        paidToDate: priceToChargeInCents / 100,
        stripeFee: event.stripeFeeInCents / 100,
        travelFee: event.travelFeeInCents / 100,
        balanceStatusDescription:
          event.paymentPlan === event_payment_plan.full ? "Final Balance" : "Deposit",
        specialDiscount: event.discountInCents / 100,
        dueDateAsString: pendingDueDate.format("MMMM D, YYYY"),
        receiptDateAsString: receiptDate.format("dddd MMMM D, YYYY"),
      };

      await sendReactEmail({
        to: event.email,
        from: env.EMAIL_FROM,
        subject: `Hipstr Booth Invoice - #${receiptNumber ?? event.eventNumber}`,
        Email: Invoice,
        emailProps: invoiceData,
      });

      const customerName = `${event.firstName} ${event.lastName}`;

      trackEvent({
        type: "Customer booked corporate event",
        distinctId: ctx.req?.cookies?.identifier ?? event.id.toString(),
        clientName: customerName,
        properties: {
          ...event,
          id: parseInt(event.id.toString()),
          availabilityId: parseInt(event.availabilityId?.toString() ?? "0"),
          userId: parseInt(event.userId?.toString() ?? "0"),
          partnerId: parseInt(event.partnerId?.toString() ?? "0"),
          hostId: parseInt(event.hostId?.toString() ?? "0"),
        }, // TODO move this to a parser function to use it in every bigint parsing problem.
      });

      const eventDate = dayjs.utc(event?.eventDate).format("MM/DD/YYYY");

      await sendReactEmail({
        to: env.EMAIL_TO_INFO_LEAD,
        from: env.EMAIL_FROM,
        subject: `Event Confirmed - ${customerName} - ${eventDate}`,
        Email: EventCreation,
        emailProps: {
          ...event,
          clientEmail: event.email,
          customerName,
          eventDate,
          budget: 0, // No approximate budget is used in corporate events.
          state: event.states.name,
          phoneNumber: event.phoneNumber,
          receiveCommunications: false, // TODO: When necessary, reuse this from the inProcessEvent.
          isCorporate: true,
          price: event.totalPriceInCents / 100,
          eventType: type.name,
          message: null,
        },
      });

      return {
        success: true,
        eventId: parseInt(event.id.toString()),
      };
    }),

  finishEventCreation: publicProcedure
    .input(newEventSchema)
    .mutation(async ({ ctx, input: { id, paymentPlan, setupIntentId, promotionalCode } }) => {
      // Checking promotionalCode validity.
      let promotionalCodeInfo: PromotionalCode | null = null;

      if (!!promotionalCode) {
        promotionalCodeInfo = await ctx.prisma.promotionalCode.findUnique({
          where: {
            code: promotionalCode,
            isActive: true,
          },
        });

        if (!promotionalCodeInfo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Promotional code not found",
          });
        }

        // Checking expiration date
        if (dayjs.utc(promotionalCodeInfo.expiresAt).isBefore(dayjs.utc(), "day")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Promotional code expired",
          });
        }
      }

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-08-16",
      });

      const inProcessEvent = await ctx.prisma.inProcessEvent.findUnique({
        where: {
          id,
        },
      });

      if (!inProcessEvent?.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing email in event",
        });

      // 1st: Creating customer in Stripe if it's not already created.
      let customer:
        | (StripeCustomer & {
            stripeSetupIntents?: StripeSetupIntent[];
          })
        | null = await ctx.prisma.stripeCustomer.findUnique({
        where: {
          email: inProcessEvent.email,
        },
        include: {
          stripeSetupIntents: true,
        },
      });

      if (!customer) {
        const stripeCustomer = await stripe.customers.create({
          description: `The customer ${inProcessEvent.email}`,
        });

        customer = await ctx.prisma.stripeCustomer.create({
          data: {
            email: inProcessEvent.email,
            stripeCustomerId: stripeCustomer.id,
          },
        });
      }

      const customerId = customer.stripeCustomerId;

      // 2nd: Retrieving setup intent.
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      if (typeof setupIntent.payment_method !== "string")
        throw new Error("Error occurred, no setup intent found");

      if (
        !customer?.stripeSetupIntents?.some(
          (existingSetupIntent) => existingSetupIntent.setupIntentId === setupIntent.id,
        )
      ) {
        // 3rd: Attaching payment method to customer.
        await stripe.paymentMethods.attach(setupIntent.payment_method, {
          customer: customerId,
        });

        await ctx.prisma.stripeSetupIntent.create({
          data: {
            stripeCustomerEmail: inProcessEvent.email,
            setupIntentId: setupIntent.id,
          },
        });
      }

      // 4th: Creating event via php's backend.
      const creatingEventInfo = {
        first_name: inProcessEvent.firstName,
        last_name: inProcessEvent.lastName,
        event_date: dayjs.utc(inProcessEvent.eventDate).format("YYYY-MM-DD"),
        city: inProcessEvent.city,
        state_id: inProcessEvent.stateId,
        market: inProcessEvent.typeId, // TODO: Change this for type instead of market when correctly saved in the database.
        package_id: inProcessEvent.packageId,
        payment_plan: paymentPlan,

        email: inProcessEvent.email,
        event_number: "event_number",
        phone_number: inProcessEvent.phoneNumber,

        setupIntentId: setupIntent.id,
      };
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": process.env.API_KEY,
        },
      };

      const response = await axios.post<{
        data: {
          event: {
            id: number;
          };
        };
        status: string;
        message: string;
      }>(`${Config.apiBaseUrl}${Config.apiVersion}${eventCreate}`, creatingEventInfo, config);

      const eventId = response.data.data.event.id;

      // 5th: Charge event price to customer.
      const paymentMethodId = setupIntent.payment_method;

      if (typeof paymentMethodId !== "string")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing payment method id",
        });

      const diffInDays = dayjs.utc(inProcessEvent.eventDate).diff(dayjs.utc(new Date()), "days");
      const isInMoreThan30Days = diffInDays > 30;
      const isInMoreThan60Days = diffInDays > 60;

      let priceToChargeInCents = 0;
      let priceToHoldInCents = 0;
      let discountInCents = 0;
      const promotionalCodeDiscountInCents = promotionalCodeInfo
        ? getPromotionalCodeDiscountInCents(promotionalCodeInfo, inProcessEvent)
        : 0;

      if (isInMoreThan60Days) {
        if (paymentPlan === event_payment_plan.full) {
          discountInCents = inProcessEvent.discountInCents;
          // Charging the full price less discount.
          priceToChargeInCents = inProcessEvent.totalPriceForFullInCents - discountInCents;
        } else {
          // Assuming plan 50/50
          // Charging 50%.
          priceToChargeInCents = Math.floor(inProcessEvent.totalPriceForPartialInCents * 0.5);
        }
      } else if (isInMoreThan30Days) {
        // Holding HOLD_PERCENTAGE and charging $0.

        if (paymentPlan === event_payment_plan.full) {
          priceToHoldInCents = Math.floor(
            inProcessEvent.totalPriceForFullInCents * HOLD_PERCENTAGE,
          );
        } else {
          // Assuming plan 50/50
          priceToHoldInCents = Math.floor(
            inProcessEvent.totalPriceForPartialInCents * HOLD_PERCENTAGE,
          );
        }
      } else {
        // Holding HOLD_PERCENTAGE and charging $0.
        priceToHoldInCents = Math.floor(inProcessEvent.totalPriceForFullInCents * HOLD_PERCENTAGE);
      }

      let paymentId = "";

      if (priceToChargeInCents) {
        // Applying entire promo code discount in the unique payment.
        priceToChargeInCents -= promotionalCodeDiscountInCents;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: priceToChargeInCents,
          confirm: true,
          currency: "usd",
          customer: customer.stripeCustomerId,
          payment_method: paymentMethodId,
          return_url: `${process.env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-paid`,
        });

        paymentId = paymentIntent.id;

        await ctx.prisma.stripePayment.create({
          data: {
            stripeCustomerEmail: customer.email,
            paymentId,
            paymentStatus: paymentIntent.status,
            amountInCents: paymentIntent.amount,
            date: new Date(paymentIntent.created * 1000),
            eventId,
          },
        });
      }

      if (priceToHoldInCents) {
        // Applying entire promo code discount in the first payment.
        priceToHoldInCents -= promotionalCodeDiscountInCents;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: priceToHoldInCents,
          capture_method: "manual",
          confirm: true,
          currency: "usd",
          customer: customer.stripeCustomerId,
          payment_method: paymentMethodId,
          return_url: `${process.env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-holded`,
        });

        paymentId = paymentIntent.id;

        await ctx.prisma.stripePayment.create({
          data: {
            stripeCustomerEmail: customer.email,
            paymentId,
            paymentStatus: paymentIntent.status,
            amountInCents: paymentIntent.amount,
            date: new Date(paymentIntent.created * 1000),
            eventId,
          },
        });
      }

      // 6th Deactivate the promotional code if any and it's a one time use code.
      if (!!promotionalCodeInfo && promotionalCodeInfo.isOneTime) {
        await ctx.prisma.promotionalCode.update({
          where: {
            code: promotionalCode,
          },
          data: {
            isActive: false,
          },
        });
      }

      // 7th Update the event with the payment info.
      await ctx.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          totalPriceInCents:
            paymentPlan === event_payment_plan.full
              ? inProcessEvent.totalPriceForFullInCents
              : inProcessEvent.totalPriceForPartialInCents,
          amountPaidInCents: priceToChargeInCents,
          firstPaymentDate: dayjs.utc().toDate(),
          discountInCents,
          travelFeeInCents: inProcessEvent.travelFeeInCents,
          retailPriceInCents: inProcessEvent.retailPriceInCents,
          stripeFeeInCents:
            paymentPlan === event_payment_plan.full
              ? inProcessEvent.stripeFeeForFullInCents
              : inProcessEvent.stripeFeeForPartialInCents,
          adminStatus: isInMoreThan60Days
            ? events_admin_status.confirmed
            : events_admin_status.awaiting,
          promotionalCodeCode: promotionalCode,
          promotionalCodeDiscountInCents,
          inProcessEventId: inProcessEvent.id,
          signUpToken: randomBytes(20).toString("hex"),
        },
      });

      if (!inProcessEvent.eventDate || !inProcessEvent.packageId)
        return {
          success: false,
          message: "Event created successfully but the mail was not sent due to missing info",
        };

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          states: true,
          eventPreferencesEventsMarketToeventPreferences: true, // TODO: Change this for type instead of market when correctly saved in the database.
          packages: true,
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (!event.eventPreferencesEventsMarketToeventPreferences || !event.states) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting event info",
        });
      }
      const type = event.eventPreferencesEventsMarketToeventPreferences; // TODO: Change this for type instead of market when correctly saved in the database.

      // 9th Send email to the customer.
      if (isInMoreThan60Days) {
        const completedBeforeDate = dayjs
          .utc(inProcessEvent.eventDate)
          .subtract(30, "days")
          .toDate();
        const finalCheckInDate = dayjs.utc(inProcessEvent.eventDate).subtract(14, "days").toDate();

        const subject = "[Action Required] Hipstr Event Confirmation + Next Steps";
        await sendReactEmail({
          to: inProcessEvent.email,
          from: env.EMAIL_FROM,
          subject,
          Email: EventConfirmation,
          emailProps: {
            firstName: inProcessEvent.firstName,
            date: new Date(inProcessEvent.eventDate),
            completedBeforeDate,
            finalCheckInDate,
            paymentPlan,
            packageId: inProcessEvent.packageId,
            eventNumber: event.eventNumber,
            signUpToken: event.signUpToken,
          },
        });

        const { pendingDueDate, pendingInCents, subtotalInCents } = getInvoiceInfo(
          event,
          discountInCents,
          promotionalCodeDiscountInCents,
          priceToChargeInCents,
        );

        const invoice = await ctx.prisma.invoice.create({
          data: {
            invoiceType:
              event.paymentPlan === event_payment_plan.full
                ? invoice_type.final_balance
                : invoice_type.deposit,
            inProcessEventId: inProcessEvent.id,
            subtotalInCents,
            pendingInCents,
            pendingDueDate: pendingDueDate.toDate(),
            eventId: event.id,
            paymentId,
          },
        });
        const receiptNumber = generateReceiptNumber(invoice.id);
        let receiptDate = dayjs.utc(invoice.invoiceDate);
        if (!receiptDate.isValid()) {
          receiptDate = dayjs.utc();
        }

        // Sending invoice only when no hold is made <=> isInMoreThan60Days
        // TODO: Missing expedited events logic
        const invoiceData: Parameters<typeof Invoice>[0] = {
          ...event,
          receiptNumber,
          state: event.states.name,
          eventDate: dayjs.utc(event.eventDate).format("dddd MMMM D, YYYY"),
          eventType: type.name,
          subtotal: subtotalInCents / 100,
          retailPrice: event.retailPriceInCents / 100,
          total: (event.totalPriceInCents - event.discountInCents) / 100,
          promotionalCodeDiscount: promotionalCodeDiscountInCents / 100,
          pending: pendingInCents / 100,
          paidToDate: priceToChargeInCents / 100,
          stripeFee: event.stripeFeeInCents / 100,
          travelFee: event.travelFeeInCents / 100,
          balanceStatusDescription:
            event.paymentPlan === event_payment_plan.full ? "Final Balance" : "Deposit",
          specialDiscount: event.discountInCents / 100,
          dueDateAsString: pendingDueDate.format("MMMM D, YYYY"),
          receiptDateAsString: receiptDate.format("dddd MMMM D, YYYY"),
        };

        await sendReactEmail({
          to: inProcessEvent.email,
          from: env.EMAIL_FROM,
          subject: `Hipstr Booth Invoice - #${receiptNumber ?? event.eventNumber}`,
          Email: Invoice,
          emailProps: invoiceData,
        });
      } else {
        const subject = "Hipstr Reservation Pending - Confirming Availability";

        await sendReactEmail({
          to: inProcessEvent.email,
          from: env.EMAIL_FROM,
          subject,
          Email: ConfirmAvailability,
          emailProps: {
            firstName: inProcessEvent.firstName,
          },
        });
      }

      trackEvent({
        type: "Customer booked event",
        distinctId: ctx.req?.cookies?.identifier ?? inProcessEvent.id,
        clientName: `${event.firstName} ${event.lastName}`,
        properties: inProcessEvent,
      });

      const customerName = `${inProcessEvent.firstName} ${inProcessEvent.lastName}`;
      const status =
        event.adminStatus === events_admin_status.awaiting ? "Need Confirm" : "Confirmed";

      const eventDate = event?.eventDate ? dayjs.utc(event?.eventDate).format("MM/DD/YYYY") : "";

      await sendReactEmail({
        to: env.EMAIL_TO_INFO_LEAD,
        from: env.EMAIL_FROM,
        subject: `Event ${status} - ${customerName} - ${eventDate}`,
        Email: EventCreation,
        emailProps: {
          clientEmail: inProcessEvent.email,
          customerName,
          eventDate,
          eventNumber: event.eventNumber,
          packageId: event.packageId,
          budget: inProcessEvent.approximateBudget,
          city: inProcessEvent.city,
          state: event.states.name,
          phoneNumber: inProcessEvent.phoneNumber,
          message: inProcessEvent.message,
          receiveCommunications: inProcessEvent.receiveCommunicationsAccepted,
          isCorporate: inProcessEvent.isCorporateEvent,
          price: event.totalPriceInCents / 100,
          eventType: type.name,
        },
      });

      return {
        success: true,
        eventId,
        event,
        packageName: event.packages.title,
        typeName: type.name,
        approximateBudget: inProcessEvent.approximateBudget,
      };
    }),

  secondPaymentFix: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        setupIntentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { eventId, setupIntentId } }) => {
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-08-16",
      });

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventPreferencesEventsMarketToeventPreferences: true,
          states: true,
          invoices: true,
        },
      });

      if (!event?.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing email in event",
        });

      if (!event.eventPreferencesEventsMarketToeventPreferences || !event.states) {
        throw new Error("Error getting event info");
      }

      // 1st: Retrieving new setup intent and getting customer.
      const [setupIntent, customer] = await Promise.all([
        stripe.setupIntents.retrieve(setupIntentId),
        ctx.prisma.stripeCustomer.findUnique({
          where: {
            email: event.email,
          },
          include: {
            stripeSetupIntents: true,
          },
        }),
      ]);

      if (typeof setupIntent.payment_method !== "string")
        throw new Error("Error occurred, no setup intent found");

      if (!customer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing customer",
        });

      // 3rd: Attaching new payment method to customer in Stripe and saving setupIntent in the DB.
      await Promise.all([
        stripe.paymentMethods.attach(setupIntent.payment_method, {
          customer: customer.stripeCustomerId,
        }),
        ctx.prisma.stripeSetupIntent.create({
          data: {
            stripeCustomerEmail: event.email,
            setupIntentId: setupIntent.id,
          },
        }),
      ]);

      // 4th: Charge event price to customer, update the event with the payment info and Send email to the customer.
      const paymentMethodId = setupIntent.payment_method;

      if (typeof paymentMethodId !== "string")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing payment method id",
        });

      const priceToChargeInCents =
        event.totalPriceInCents -
        event.amountPaidInCents -
        event.discountInCents -
        (event.promotionalCodeDiscountInCents ?? 0);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceToChargeInCents,
        confirm: true,
        currency: "usd",
        customer: customer.stripeCustomerId,
        payment_method: paymentMethodId,
        return_url: `${process.env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-paid`,
      });

      const type = event.eventPreferencesEventsMarketToeventPreferences; // TODO: Change this for type instead of market when correctly saved in the database.

      const promotionalCodeDiscountInCents = event.promotionalCodeDiscountInCents ?? 0;

      const newAmountPaidInCents = event.amountPaidInCents + priceToChargeInCents;

      const subtotalInCents = getSubtotalInCents(event);

      const paidBeforeInCents = event.amountPaidInCents;

      const invoice = await ctx.prisma.invoice.create({
        data: {
          invoiceType: invoice_type.final_balance,
          inProcessEventId: event.inProcessEventId ?? undefined,
          eventId: event.id,
          paymentId: paymentIntent.id,
          subtotalInCents,
          paidBeforeInCents,
        },
      });
      const receiptNumber = generateReceiptNumber(invoice.id);
      let receiptDate = dayjs.utc(invoice.invoiceDate);
      if (!receiptDate.isValid()) {
        receiptDate = dayjs.utc();
      }

      // Sending second payment invoice.
      // TODO: Missing expedited events logic

      const invoiceData: Parameters<typeof Invoice>[0] = {
        ...event,
        receiptNumber,
        state: event.states.name,
        eventDate: dayjs.utc(event.eventDate).format("dddd MMMM D, YYYY"),
        eventType: type.name,
        subtotal: subtotalInCents / 100,
        retailPrice: event.retailPriceInCents / 100,
        paidBefore: paidBeforeInCents / 100,
        firstPaymentDateAsString: dayjs.utc(event.firstPaymentDate).format("MMMM Do, YYYY"),
        total: (event.totalPriceInCents - event.discountInCents) / 100,
        promotionalCodeDiscount: promotionalCodeDiscountInCents / 100,
        pending: 0,
        paidToDate: newAmountPaidInCents / 100,
        stripeFee: event.stripeFeeInCents / 100,
        travelFee: event.travelFeeInCents / 100,
        balanceStatusDescription: "Final Balance",
        specialDiscount: event.discountInCents / 100,
        receiptDateAsString: receiptDate.format("dddd MMMM D, YYYY"),
      };

      await Promise.all([
        ctx.prisma.stripePayment.create({
          data: {
            stripeCustomerEmail: customer.email,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            amountInCents: paymentIntent.amount,
            date: new Date(paymentIntent.created * 1000),
            eventId,
          },
        }),
        ctx.prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            amountPaidInCents: newAmountPaidInCents,
          },
        }),
        sendReactEmail({
          to: event.email,
          from: env.EMAIL_FROM,
          subject: `Hipstr Booth Invoice - #${receiptNumber ?? event.eventNumber}`,
          Email: Invoice,
          emailProps: invoiceData,
        }),
      ]);

      return {
        success: true,
        eventId: parseInt(event.id.toString()),
      };
    }),

  applyPromotionalCode: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        promotionalCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { eventId, promotionalCode } }) => {
      // Getting promotional code info.
      const promotionalCodeInfo = await ctx.prisma.promotionalCode.findUnique({
        where: {
          code: promotionalCode,
          isActive: true,
        },
      });

      if (!promotionalCodeInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Promotional code not found",
        });
      }

      // Checking expiration date
      if (dayjs.utc(promotionalCodeInfo.expiresAt).isBefore(dayjs.utc(), "day")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Promotional code expired",
        });
      }

      const inProcessEvent = await ctx.prisma.inProcessEvent.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!inProcessEvent)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });

      const discountInCents = getPromotionalCodeDiscountInCents(
        promotionalCodeInfo,
        inProcessEvent,
      );

      return {
        success: true,
        discountInCents,
      };
    }),
});
