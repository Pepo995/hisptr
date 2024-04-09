import { z } from "zod";

export const saveEventContactUsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  eventDate: z.date().optional(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  stateId: z.number().nullable(),
  budgetForPrice: z.number().nullable(),
  packageId: z.number().nullable(),
  typeId: z.number().nullable(),
  message: z.string().optional(),
  consent: z.boolean(),
  captchaToken: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  utmId: z.string().optional(),
  clientId: z.string(),
});
