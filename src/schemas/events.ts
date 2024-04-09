import { z } from "zod";
import { eventVenueDetailsCOI } from "@types";

export const customerUpdateEvent = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  reachVia: z.string(),
  eventDate: z.string(),
  phoneNumber: z.string(),
  isEventPlanner: z.enum(["yes", "no"]),
  typeId: z.number(),
  categoryId: z.number(),
  guestCount: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  email: z.string().email(),
});

export const customerUpdateVenue = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  email: z.string(),
  city: z.string(),
  stateId: z.number(),
  zipcode: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  COI: z.nativeEnum(eventVenueDetailsCOI),
});

export const customerUpdateSetup = z.object({
  id: z.string(),
  contactName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  location: z.string(),
  isParkingAvailable: z.enum(["yes", "no"]),
  setupLocation: z.enum(["indoor", "outdoor"]),
  availableForSetup: z.enum(["yes", "no"]),
  isElevatorAvailable: z.enum(["yes", "no", "not_needed"]),
  setupDetails: z.string(),
  allocationSpaceVerified: z.boolean(),
});

export const customerUpdatePersonalization = z.object({
  id: z.string(),
  filterType: z.number(),
  orientationType: z.number(),
  designType: z.number(),
  firstLine: z.string(),
  secondLine: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  vision: z.string().optional(),
  logo: z.string().min(0).nullable().optional(),
  backdropType: z.number(),
});
