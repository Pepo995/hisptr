import { type NextApiRequest, type NextApiResponse } from "next";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY)
  throw new Error("Missing STRIPE_SECRET_KEY");

// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const setupIntent = await stripe.setupIntents.create();

  res.send({
    clientSecret: setupIntent.client_secret,
  });
};

export default handler;
