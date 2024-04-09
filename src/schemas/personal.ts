import dayjs from "dayjs";
import { z } from "zod";
import { event_payment_plan, events_admin_status } from "@prisma/client";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const saveEventStep1Schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  typeId: z.number(),
  city: z.string(),
  stateId: z.number(),
  consent: z.boolean(),
  eventId: z.string().optional(),
  captchaToken: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  utmId: z.string().optional(),
  clientId: z.string(),
});

const eventDateValidator = z.coerce
  .date()
  .min(dayjs.utc(dayjs().startOf("day")).add(2, "day").toDate(), {
    message: "Date must be at least 2 days from now",
  });

export const saveEventStep2Schema = z.object({
  eventDate: eventDateValidator,
  phoneNumber: z.string(),
  approximateBudget: z.number(),
  message: z.string().optional(),
  eventId: z.string(),
});

export const saveEventStep3Schema = z.object({
  packageId: z.number(),
  eventId: z.string(),
});

export const createCustomLeadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  city: z.string(),
  stateId: z.number(),

  eventDate: z.date(),
  phoneNumber: z.string(),
  approximateBudget: z.number(),
});

const EventPaymentPlans = z.nativeEnum(event_payment_plan);
type EventPaymentPlans = z.infer<typeof EventPaymentPlans>;

export const EventAdminStatus = z.nativeEnum(events_admin_status);
type EventAdminStatus = z.infer<typeof EventPaymentPlans>;

export const newEventSchema = z.object({
  id: z.string(),
  paymentPlan: EventPaymentPlans,
  saveCardDetails: z.boolean(),
  setupIntentId: z.string(),
  promotionalCode: z.string().optional(),
});
