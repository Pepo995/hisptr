import EventConfirmation from "@emails/eventConfirmation";
import Invoice from "@emails/invoice";
import {
  StripePaymentEnum,
  event_payment_plan,
  event_setup_details_available_for_setup,
  event_setup_details_is_elevator_available,
  event_setup_details_is_parking_available,
  event_setup_details_setup_location,
  events_admin_status,
} from "@prisma/client";
import { adminProtectedProcedure, createTRPCRouter } from "@server/api/trpc";
import { prisma } from "@server/db";
import { sendEmail } from "@server/services/emails";
import { generateReceiptNumber } from "@server/services/invoiceCreator";
import { sendReactEmail } from "@server/services/sendReactEmail";
import { eventDateNotAvailableContent } from "@server/templates/eventDateNotAvailable";
import { TRPCError } from "@trpc/server";
import { eventVenueDetailsCOI } from "@types";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env.mjs";
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

const updateEventBasicDetailsSchema = z.object({
  id: z.number(),
  typeId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  guestCount: z.number(),
  categoryId: z.number(),
});

const updateEventVenueDetailsSchema = z.object({
  id: z.number(),
  contactFirstName: z.string(),
  contactLastName: z.string(),
  contactEmail: z.string(),
  venueName: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  stateId: z.number(),
  zipcode: z.string(),
  COI: z.nativeEnum(eventVenueDetailsCOI),
});

const updateEventOnSiteDetailsSchema = z.object({
  eventId: z.number(),
  contactName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  location: z.string(),
  parkingAvailability: z.nativeEnum(event_setup_details_is_parking_available),
  setupLocation: z.nativeEnum(event_setup_details_setup_location),
  availableForSetup: z.nativeEnum(event_setup_details_available_for_setup),
  setupDetails: z.string(),
  elevatorAvailability: z.nativeEnum(event_setup_details_is_elevator_available),
});

const updateEventAdminDetailsSchema = z.object({
  id: z.number(),
  adminStatus: z.nativeEnum(events_admin_status),
  partnerId: z.number().nullable(),
});

const updateEventPersonalizationDetailsSchema = z.object({
  id: z.number(),
  filter_type: z.number(),
  orientation_type: z.number(),
  design_type: z.number(),
  first_line: z.string(),
  second_line: z.string(),
  primary_color: z.string(),
  secondary_color: z.string(),
  vision: z.string(),
  backdrop_type: z.number(),
  logo: z.string().nullable().optional(),
});

export type UpdateEventBasicDetailsInput = z.infer<typeof updateEventBasicDetailsSchema>;
export type UpdateEventVenueDetailsInput = z.infer<typeof updateEventVenueDetailsSchema>;
export type UpdateEventOnSiteDetailsInput = z.infer<typeof updateEventOnSiteDetailsSchema>;
export type UpdateEventPersonalizationDetailsInput = z.infer<
  typeof updateEventPersonalizationDetailsSchema
>;

export const eventAdminRouter = createTRPCRouter({
  updateEventBasicDetails: adminProtectedProcedure
    .input(updateEventBasicDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // start and end time are in HH:mm format, so we need to convert them to a date
        const [startHour, startMinute] = input.startTime.split(":").map((n) => parseInt(n));
        const [endHour, endMinute] = input.endTime.split(":").map((n) => parseInt(n));
        const startTime = dayjs().utc().set("hour", startHour).set("minute", startMinute).toDate();
        const endTime = dayjs().utc().set("hour", endHour).set("minute", endMinute).toDate();
        await ctx.prisma.event.update({
          where: {
            id: input.id,
          },
          data: {
            typeId: input.typeId,
            startTime,
            endTime,
            guestCount: input.guestCount,
            categoryId: input.categoryId,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating event",
        });
      }
    }),
  updateEventVenueDetails: adminProtectedProcedure
    .input(updateEventVenueDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const venueDetailId = await ctx.prisma.event.findFirst({
          where: { id: input.id },
          select: {
            eventVenueDetails: {
              select: {
                id: true,
              },
            },
          },
        });
        if (!venueDetailId || venueDetailId.eventVenueDetails.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error finding venue details",
          });
        }
        const venueDetail = venueDetailId.eventVenueDetails[0];

        await ctx.prisma.eventVenueDetail.update({
          where: {
            id: venueDetail.id,
          },
          data: {
            firstName: input.contactFirstName,
            lastName: input.contactLastName,
            email: input.contactEmail,
            name: input.venueName,
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2,
            city: input.city,
            stateId: input.stateId,
            zipcode: input.zipcode,
            COI: input.COI,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating venue details",
        });
      }
    }),
  updateEventOnSiteDetails: adminProtectedProcedure
    .input(updateEventOnSiteDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const event = await ctx.prisma.event.findFirst({
          where: { id: input.eventId },
          select: {
            eventSetupDetails: { select: { id: true } },
          },
        });
        if (!event?.eventSetupDetails || event.eventSetupDetails.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error finding on site details",
          });
        }
        const { id } = event.eventSetupDetails[0];
        await ctx.prisma.eventSetupDetail.update({
          where: {
            id,
          },
          data: {
            contactName: input.contactName,
            phoneNumber: input.phoneNumber,
            email: input.email,
            location: input.location,
            isParkingAvailable: input.parkingAvailability,
            setupLocation: input.setupLocation,
            availableForSetup: input.availableForSetup,
            setupDetails: input.setupDetails,
            isElevatorAvailable: input.elevatorAvailability,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating on site details",
        });
      }
    }),
  updateEventAdminDetails: adminProtectedProcedure
    .input(updateEventAdminDetailsSchema)
    .mutation(async ({ input }) => {
      const event = await prisma.event.findUnique({ where: { id: input.id } });
      if (!event)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });

      if (input.adminStatus === events_admin_status.awaiting) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can't set event back to awaiting admin confirmation",
        });
      }

      if (event.adminStatus === events_admin_status.awaiting) {
        return await updateEventAdminStatus({
          eventId: input.id,
          adminStatus: input.adminStatus,
          partnerId: input.partnerId,
        });
      } else {
        await prisma.event.update({
          where: {
            id: input.id,
          },
          data: {
            adminStatus: input.adminStatus,
            partnerId: input.partnerId,
          },
        });
        return {
          success: true,
        };
      }
    }),
  updateEventPersonalizationDetails: adminProtectedProcedure
    .input(updateEventPersonalizationDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const event = await ctx.prisma.event.findFirst({
          where: { id: input.id },
          select: { eventPhotosDetails: { select: { id: true } } },
        });
        if (!event?.eventPhotosDetails || event.eventPhotosDetails.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error finding personalization details",
          });
        }
        const { id } = event.eventPhotosDetails[0];

        await ctx.prisma.eventPhotosDetail.update({
          where: {
            id,
          },
          data: {
            filterType: input.filter_type,
            orientationType: input.orientation_type,
            designType: input.design_type,
            firstLine: input.first_line,
            secondLine: input.second_line,
            primaryColor: input.primary_color,
            secondaryColor: input.secondary_color,
            vision: input.vision,
            backdropType: input.backdrop_type,
            logo: input.logo,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating personalization details",
        });
      }
    }),
});

const updateEventAdminStatus = async ({
  eventId,
  adminStatus,
  partnerId,
}: {
  eventId: number;
  adminStatus: events_admin_status;
  partnerId: number | null;
}) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      payments: true,
      states: true,
      eventPreferencesEventsMarketToeventPreferences: true, // TODO: Change this for type instead of market when correctly saved in the database.
      invoices: true,
    },
  });

  if (!event)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });

  if (event.adminStatus !== events_admin_status.awaiting)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Event is not pending",
    });

  if (!event.eventPreferencesEventsMarketToeventPreferences || !event.states)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error getting event info",
    });

  const type = event.eventPreferencesEventsMarketToeventPreferences; // TODO: Change this for type instead of market when correctly saved in the database.

  const customer = await prisma.stripeCustomer.findUnique({
    where: {
      email: event.email,
    },
    include: {
      stripeSetupIntents: true,
    },
  });

  if (!customer)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Customer not found",
    });

  if (!customer.stripeSetupIntents.length)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Error occurred, no setup intents found in customer",
    });

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  let amountPaidInCents = 0;

  if (adminStatus === events_admin_status.confirmed) {
    const capture = await stripe.paymentIntents.capture(event.payments[0].paymentId);

    if (!capture.amount_received)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error occurred, no amount captured",
      });

    await prisma.stripePayment.update({
      where: {
        stripeCustomerEmail_paymentId: {
          stripeCustomerEmail: event.payments[0].stripeCustomerEmail,
          paymentId: event.payments[0].paymentId,
        },
      },
      data: {
        paymentStatus: StripePaymentEnum.succeeded,
      },
    });

    const amountCapturedInCents = capture.amount_received;

    const percentToCharge = event.paymentPlan === event_payment_plan.full ? 1 : 0.5;

    const amountToChargeInCents = Math.floor(event.totalPriceInCents * percentToCharge);

    let priceToChargeInCents = 0;

    const firstPaymentAmountInCents =
      amountCapturedInCents + (event.promotionalCodeDiscountInCents ?? 0); // Considering the promotional code discount applied in the first payment if more than one.

    if (firstPaymentAmountInCents < amountToChargeInCents) {
      priceToChargeInCents = amountToChargeInCents - firstPaymentAmountInCents; // Charging the remaining amount taking into account the promotional code discount.

      const setupIntent = await stripe.setupIntents.retrieve(
        customer.stripeSetupIntents[customer.stripeSetupIntents.length - 1].setupIntentId,
      );

      if (typeof setupIntent.payment_method !== "string")
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Error occurred, no payment method found",
        });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceToChargeInCents,
        confirm: true,
        currency: "usd",
        customer: customer.stripeCustomerId,
        payment_method: setupIntent.payment_method,
        return_url: `${process.env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-paid`,
      });

      // Create the payment record.
      await prisma.stripePayment.create({
        data: {
          stripeCustomerEmail: customer.email,
          paymentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          amountInCents: paymentIntent.amount,
          date: new Date(paymentIntent.created * 1000),
          eventId,
        },
      });
    }

    amountPaidInCents = amountCapturedInCents + priceToChargeInCents;

    const completedBeforeDate = dayjs.utc(event.eventDate).subtract(30, "days").toDate();
    const finalCheckInDate = dayjs.utc(event.eventDate).subtract(14, "days").toDate();
    const subject = "[Action Required] Hipstr Event Confirmation + Next Steps";

    await sendReactEmail({
      to: event.email,
      from: env.EMAIL_FROM,
      subject,
      Email: EventConfirmation,
      emailProps: {
        firstName: event.firstName,
        date: event.eventDate,
        eventNumber: event.eventNumber,
        completedBeforeDate,
        finalCheckInDate,
        paymentPlan: event.paymentPlan,
        packageId: event.packageId,
        signUpToken: event.signUpToken,
      },
    });
  } else if (adminStatus === events_admin_status.cancelled) {
    // Update the payment record.
    await prisma.stripePayment.update({
      where: {
        stripeCustomerEmail_paymentId: {
          stripeCustomerEmail: customer.email,
          paymentId: event.payments[0].paymentId,
        },
      },
      data: {
        paymentStatus: StripePaymentEnum.canceled,
        eventId,
      },
    });
  }

  if (partnerId) {
    const partner = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!partner || partner.type != "partner") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Partner not found",
      });
    }
  }
  await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      adminStatus,
      amountPaidInCents,
      firstPaymentDate: dayjs.utc().toDate(),
      partnerId,
    },
  });

  if (adminStatus === events_admin_status.confirmed) {
    const promotionalCodeDiscountInCents = event.promotionalCodeDiscountInCents ?? 0;

    const receiptNumber = event.invoices[0] ? generateReceiptNumber(event.invoices[0].id) : null;

    // TODO: Missing expedited events logic
    const invoiceData: Parameters<typeof Invoice>[0] = {
      ...event,
      receiptNumber,
      state: event.states.name,
      eventDate: dayjs.utc(event.eventDate).format("dddd MMMM D, YYYY"),
      eventType: type.name,
      subtotal: (event.totalPriceInCents - event.stripeFeeInCents - event.travelFeeInCents) / 100,
      retailPrice: event.retailPriceInCents / 100,
      total: (event.totalPriceInCents - event.discountInCents) / 100,
      pending:
        (event.totalPriceInCents -
          event.discountInCents -
          promotionalCodeDiscountInCents -
          amountPaidInCents) /
        100,
      promotionalCodeDiscount: promotionalCodeDiscountInCents / 100,
      paidToDate: amountPaidInCents / 100,
      stripeFee: event.stripeFeeInCents / 100,
      travelFee: event.travelFeeInCents / 100,
      balanceStatusDescription:
        event.paymentPlan === event_payment_plan.full ? "Final Balance" : "Deposit",
      specialDiscount: event.discountInCents / 100,
      dueDateAsString: dayjs.utc(event.eventDate).subtract(30, "day").format("MMMM D, YYYY"),
      receiptDateAsString: dayjs
        .utc(event.invoices[0]?.invoiceDate ?? "")
        .format("dddd MMMM D, YYYY"),
    };

    await sendReactEmail({
      to: event.email,
      from: env.EMAIL_FROM,
      subject: `Hipstr Booth Invoice - #${receiptNumber ?? event.eventNumber}`,
      Email: Invoice,
      emailProps: invoiceData,
    });
  }

  if (adminStatus === events_admin_status.cancelled) {
    const { text, html } = eventDateNotAvailableContent(event.firstName);

    const subject = "Hipstr - Not Available for Your Event Date";

    await sendEmail({
      to: event.email,
      from: env.EMAIL_FROM,
      subject,
      text,
      html,
    });
  }
  return {
    success: true,
  };
};
