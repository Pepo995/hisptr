import { CARD_SAVE_REQUIRED } from "@constants/ValidationConstants";
import { event_payment_plan } from "@prisma/client";
import * as Yup from "yup";

const validationSchema = Yup.object({
  payOption: Yup.string().required(),
  consent: Yup.boolean().when("payOption", {
    is: (payOption: string) => payOption === event_payment_plan.full.toString(),
    then: () => Yup.boolean().notRequired(),
    otherwise: () => Yup.boolean().isTrue(CARD_SAVE_REQUIRED),
  }),
  promotionalCode: Yup.string().optional(),
  acceptTermsAndConditions: Yup.boolean().isTrue("You must accept the terms & conditions"),
});

export const payCorporateEventSchema = Yup.object({
  consent: Yup.boolean().when("payOption", {
    is: (payOption: string) => payOption === event_payment_plan.full.toString(),
    then: () => Yup.boolean().notRequired(),
    otherwise: () => Yup.boolean().isTrue(CARD_SAVE_REQUIRED),
  }),
  acceptTermsAndConditions: Yup.boolean().isTrue("You must accept the terms & conditions"),
});

export default validationSchema;
