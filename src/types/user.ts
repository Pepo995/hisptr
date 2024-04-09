export type UserFromPhp = {
  company: string;
  detail: { address: string };
  type: "superadmin" | "member" | "partneruser" | "partner" | "customer";
  last_name: string;
  id: string;
  first_name: string;
  email: string;
  phone_number?: string;
  is_online?: boolean;
  picture?: string;
};
