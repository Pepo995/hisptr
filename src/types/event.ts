import type { EventPreference } from "@prisma/client";
import { type UserFromPhp } from "./user";
import { type Setup, type Venue } from "./entities";

export type AdminStatusLabels =
  | "Hipstr Account Invite Sent"
  | "Awaiting Admin Confirmation"
  | "Awaiting Event Details"
  | "Cancelled by Admin"
  | "Event Details Received"
  | "Event Planning In Progress"
  | "Awaiting Host Details"
  | "Ready To Execute Event"
  | "Event Serviced";

export type CustomerStatusLabels =
  | "Awaiting Admin Confirmation"
  | "Awaiting Event Details"
  | "Cancelled by Admin"
  | "Event Planning In Progress"
  | "Event Service";

type PhotoFromPhp = {
  backdrop_type: number;
  design_type: number;
  filter_type: number;
  first_line: string;
  logoFile: File;
  logo?: string;
  orientation_type: number;
  orientation?: { code: string; name: string };
  primary_color: string;
  second_line: string;
  secondary_color: string;
  vision: string;
};

export type EventFromPhp = {
  admin_status: AdminStatusLabels;
  agreement?: string;
  amount_paid_in_cents?: number;
  availability_id?: number;
  availaility?: { availability_number: number };
  category_id: number;
  city?: string;
  customer_status: string;
  email: string;
  end_time: string;
  event_date: string;
  event_number: number;
  first_name: string;
  guest_count: number | null;
  id: number;
  is_agree: boolean;
  is_event_planner: "yes" | "no";
  last_name: string;
  market: { name: string };
  package?: { title: string };
  phone_number: string;
  photos?: PhotoFromPhp;
  planner_company_name: string;
  planner_email: string;
  planner_first_name: string;
  planner_last_name: string;
  planner_phone_number: string;
  reach_via?: number;
  setup: Setup;
  start_time: string;
  state?: { name: string };
  status: CustomerStatusLabels;
  total_price_in_cents?: number;
  type_id: number;
  type?: EventPreference;
  user?: UserFromPhp;
  venue?: Venue;
  discount_in_cents?: number;
};

export type EventReduced = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  eventDate: Date | null;
};

export type LineItem = {
  id: number;
  type: "package" | "add-on";
  name: string;
  description: string;
  quantity: number;
  retailPriceInCents: number;
  lineAmountInCents: number;
};
