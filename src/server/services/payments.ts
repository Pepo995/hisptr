import { type Event, invoice_type } from "@prisma/client";
import { prisma } from "@db";
import Stripe from "stripe";
import { sendReactEmail } from "./sendReactEmail";
import { env } from "~/env.mjs";
import Invoice from "@emails/invoice";
import AdminReminder from "@emails/secondPaymentFailed/adminReminder";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { generateReceiptNumber, getSubtotalInCents } from "./invoiceCreator";
dayjs.extend(utc);
dayjs.extend(advancedFormat);

export const makeSecondPayment = async (
  event: Pick<
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
  >,
  emailForSecondPaymentFix: ({
    eventId,
    name,
  }: {
    eventId: number;
    name: string;
  }) => React.JSX.Element,
  subjectForSecondPaymentFix: string,
  daysBeforeOfPaymentTry: number,
) => {
  // Preventing BigInt and Int mixing.
  const amountPaidInCents = parseInt(event.amountPaidInCents.toString());
  const promotionalCodeDiscountInCents = parseInt(
    event.promotionalCodeDiscountInCents?.toString() ?? "0",
  );
  const totalPriceInCents = parseInt(event.totalPriceInCents.toString());
  const discountInCents = parseInt(event.discountInCents.toString());

  const priceToChargeInCents =
    totalPriceInCents - discountInCents - promotionalCodeDiscountInCents - amountPaidInCents;
  const eventId = parseInt(event.id.toString());

  if (priceToChargeInCents <= 0)
    return {
      success: false,
      eventId,
      message: "Full payment already made",
    };

  const customer = await prisma.stripeCustomer.findUnique({
    where: { email: event.email },
    include: { stripeSetupIntents: true },
  });

  if (!customer)
    return {
      success: false,
      eventId,
      message: "Customer not found",
    };

  if (!customer.stripeSetupIntents.length)
    return {
      success: false,
      eventId,
      message: "No setup intent found",
    };

  const setupIntentId =
    customer.stripeSetupIntents[customer.stripeSetupIntents.length - 1].setupIntentId;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

  if (typeof setupIntent.payment_method !== "string")
    return {
      success: false,
      eventId,
      message: "Error occurred, no payment method found",
    };

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceToChargeInCents,
      confirm: true,
      currency: "usd",
      customer: customer.stripeCustomerId,
      payment_method: setupIntent.payment_method,
      return_url: `${env.NEXT_PUBLIC_BASENAME_URL}/customer/payment/successfully-paid`,
    });

    // Create the payment record and update the event with the payment info.
    const newAmountPaidInCents = amountPaidInCents + priceToChargeInCents;
    const [updatedEvent] = await Promise.all([
      prisma.event.update({
        where: { id: event.id },
        data: {
          amountPaidInCents: newAmountPaidInCents,
        },
        include: { states: true, eventPreferencesEventsMarketToeventPreferences: true }, // TODO: Change this for type instead of market when correctly saved in the database.
      }),
      prisma.stripePayment.create({
        data: {
          eventId: event.id,
          paymentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          stripeCustomerEmail: customer.email,
          amountInCents: paymentIntent.amount,
          date: new Date(paymentIntent.created * 1000),
        },
      }),
    ]);

    if (!updatedEvent.eventPreferencesEventsMarketToeventPreferences || !updatedEvent.states) {
      return {
        success: false,
        eventId,
        message: "Error getting event info",
      };
    }

    const type = updatedEvent.eventPreferencesEventsMarketToeventPreferences; // TODO: Change this for type instead of market when correctly saved in the database.

    const subtotalInCents = getSubtotalInCents(updatedEvent);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceType: invoice_type.final_balance,
        inProcessEventId: updatedEvent.inProcessEventId ?? undefined,
        eventId: updatedEvent.id,
        paymentId: paymentIntent.id,
        subtotalInCents,
        paidBeforeInCents: amountPaidInCents,
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
      ...updatedEvent,
      receiptNumber,
      state: updatedEvent.states.name,
      eventDate: dayjs.utc(updatedEvent.eventDate).format("dddd MMMM D, YYYY"),
      eventType: type.name,
      subtotal: subtotalInCents / 100,
      retailPrice: updatedEvent.retailPriceInCents / 100,
      total: (updatedEvent.totalPriceInCents - updatedEvent.discountInCents) / 100,
      paidBefore: amountPaidInCents / 100,
      firstPaymentDateAsString: dayjs.utc(event.firstPaymentDate).format("MMMM Do, YYYY"),
      promotionalCodeDiscount: promotionalCodeDiscountInCents / 100,
      paidToDate: newAmountPaidInCents / 100,
      pending: 0,
      stripeFee: updatedEvent.stripeFeeInCents / 100,
      travelFee: updatedEvent.travelFeeInCents / 100,
      balanceStatusDescription: "Final Balance",
      specialDiscount: updatedEvent.discountInCents / 100,
      receiptDateAsString: receiptDate.format("dddd MMMM D, YYYY"),
    };

    await sendReactEmail({
      to: updatedEvent.email,
      from: env.EMAIL_FROM,
      bcc: env.SECOND_PAYMENT_BCC,
      subject: `Hipstr Booth Invoice - #${receiptNumber ?? updatedEvent.eventNumber}`,
      Email: Invoice,
      emailProps: invoiceData,
    });

    return { success: true, eventId };
  } catch (error) {
    console.error("---> error", error);

    const emailProps = {
      eventId,
      name: event.firstName,
    };

    // Sending mail to take the user to the system and
    // fix the second payment that has failed.
    void sendReactEmail({
      to: event.email,
      from: env.EMAIL_FROM,
      subject: subjectForSecondPaymentFix,
      Email: emailForSecondPaymentFix,
      emailProps,
    });

    const adminReminderProps = {
      ...emailProps,
      eventDateAsString: dayjs(event.eventDate).format("dddd MMMM D, YYYY"),
      daysPastDue: 30 - daysBeforeOfPaymentTry,
      email: event.email,
    };

    void sendReactEmail({
      to: env.EMAIL_TO_ADMIN,
      from: env.EMAIL_FROM,
      subject: "[REMINDER] Second payment has failed for a client",
      Email: AdminReminder,
      emailProps: adminReminderProps,
    });

    return {
      success: false,
      eventId,
      message: "Second payment failed, a mail was sent to the customer",
    };
  }
};
