import type { event_payment_plan } from "@prisma/client";

export type FormValues = {
  payOption: string;
  consent: boolean;
  promotionalCode: string;
  acceptTermsAndConditions: boolean;
};

export type PayCorporateFormValues = {
  consent: boolean;
  acceptTermsAndConditions: boolean;
};

export type PayOption = {
  title: string;
  subtitle?: string;
  alertText?: string;
  value: event_payment_plan;
  price: number;
};
