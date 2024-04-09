import { z } from "zod";

export const createCorporateInProcessEventSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  typeId: z.number(),
  city: z.string(),
  stateId: z.number(),
  consent: z.boolean(),

  eventDate: z.date(),
  phoneNumber: z.string(),
  approximateBudget: z.number(),
  captchaToken: z.string(),
  clientId: z.string(),
});

export const payCorporateEventSchema = z.object({
  id: z.number(),
  saveCardDetails: z.boolean(),
  setupIntentId: z.string(),
});
