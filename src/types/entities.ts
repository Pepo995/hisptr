export type State = {
  id: number;
  name: string;
};

export type EventType = {
  id: number;
  name: string;
};

export type Market = {
  id: number;
  name: string;
};

export type Partner = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  detail: { designation: string };
  is_active: number | string;
};

export type Venue = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  COI: string;
  document: string;
  email: string;
  event: { market: { name: string } };
  first_name: string;
  is_elevator_available: "yes" | "no";
  last_name: string;
  name: string;
  state_id: number;
  state: { name: string };
  zipcode: string;
};

export type Setup = {
  contact_name: string;
  phone_number: string;
  email: string;
  location: string;
  is_parking_available: "yes" | "no";
  setup_location: "indoor" | "outdoor";
  available_for_setup: "yes" | "no";
  is_elevator_available: "yes" | "no" | "not_needed";
  setup_details: string;
};
