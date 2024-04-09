import type { Event, StripePayment } from "@prisma/client";

export type EventForFrontend = Omit<
  Event,
  "availabilityId" | "hostId" | "id" | "partnerId" | "userId"
> & {
  id: number;
  availabilityId?: number;
  hostId?: number;
  partnerId?: number;
  userId?: number;
};

export type StripePaymentForFrontend = Omit<StripePayment, "eventId"> & { eventId: number };

export const parseEvent = (event: Event): EventForFrontend => ({
  ...event,
  id: parseInt(event.id?.toString()),
  availabilityId: event.availabilityId ? parseInt(event.availabilityId.toString()) : undefined,
  hostId: event.hostId ? parseInt(event.hostId.toString()) : undefined,
  partnerId: event.partnerId ? parseInt(event.partnerId.toString()) : undefined,
  userId: event.userId ? parseInt(event.userId.toString()) : undefined,
});

export const parsePayment = (payment: StripePayment): StripePaymentForFrontend => ({
  ...payment,
  eventId: parseInt(payment.eventId.toString()),
});
