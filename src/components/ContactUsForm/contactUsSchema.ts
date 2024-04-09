import { EMAIL_REGEX } from "@constants/RegexConstants";
import {
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_DATE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_REQUIRED,
} from "@constants/ValidationConstants";
import { z } from "zod";

export const contactUsSchema = z.object({
  firstName: z.string({ required_error: FIRST_NAME_REQUIRED }).max(25, FIRST_NAME_MAX_LENGTH),
  lastName: z.string({ required_error: LAST_NAME_REQUIRE }).max(25, LAST_NAME_MAX_LENGTH),
  eventDate: z.string({ required_error: EVENT_DATE_REQUIRED }).optional(),
  email: z
    .string({ required_error: EMAIL_REQUIRED })
    .email({ message: EMAIL_VALID })
    .refine((v) => EMAIL_REGEX.test(v), EMAIL_VALID),
  phoneNumber: z.string({ required_error: PHONE_REQUIRED }).refine(
    (val) => {
      const valWithoutSpecialChars = val?.replace(/[\s()_-]/g, "").length || 0;
      return valWithoutSpecialChars === 10;
    },
    {
      message: PHONE_MAX_LENGTH,
    },
  ),
  city: z.string().optional(),
  stateId: z.string().optional(),
  budgetForPrice: z.string().optional(),
  packageId: z.string().optional(),
  typeId: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().optional(),
});
