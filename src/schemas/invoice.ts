import { EMAIL_REGEX } from "@constants/RegexConstants";
import {
  CITY_REQUIRED,
  DATE_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_DATE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  MARKET_REQUIRED,
  PHONE_MAX_LENGTH,
  PHONE_MIN_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";
import { z } from "zod";

const eventLineItemSchema = z.object({
  id: z.number(),
  type: z.enum(["package", "add-on"]),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  retailPriceInCents: z.number(),
  lineAmountInCents: z.number(),
});

export const createInvoiceFormSchema = z.object({
  firstName: z
    .string({
      required_error: FIRST_NAME_REQUIRED,
    })
    .max(25, FIRST_NAME_MAX_LENGTH),
  lastName: z.string({ required_error: LAST_NAME_REQUIRE }).max(25, LAST_NAME_MAX_LENGTH),
  city: z.string({ required_error: CITY_REQUIRED }),
  stateId: z.number({ required_error: STATE_REQUIRED }),
  invoiceDate: z.string({ required_error: DATE_REQUIRED }),
  dueDate: z.string({ required_error: DATE_REQUIRED }),
  eventDate: z.string({ required_error: EVENT_DATE_REQUIRED }),
  phoneNumber: z
    .string({ required_error: PHONE_REQUIRED })
    .min(10, PHONE_MIN_LENGTH)
    .max(10, PHONE_MAX_LENGTH)
    .regex(PHONE_NO_REGEX, {
      message: PHONE_NO_VALID,
    }),
  marketName: z.string({ required_error: MARKET_REQUIRED }),
  eventLineItems: z.array(eventLineItemSchema),
});

export const createInvoiceSchema = createInvoiceFormSchema.extend({
  inProcessEventId: z.string(),
  email: z
    .string({ required_error: EMAIL_REQUIRED })
    .email({ message: EMAIL_VALID })
    .refine((v) => EMAIL_REGEX.test(v), EMAIL_VALID),
});
