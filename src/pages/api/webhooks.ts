import Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@db";
import { env } from "~/env.mjs";

const failWithMessage = (res: NextApiResponse, message: string) => {
  res.status(500).send(message);
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    if (!sig) {
      failWithMessage(res, "Stripe signature not found");
      return;
    }

    if (!webhookSecret) {
      failWithMessage(res, "Stripe webhook secret not found");
      return;
    }

    try {
      const body = await buffer(req);
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      // On error, log and return the error message.
      const error = err as { message: string };
      console.error(`❌ Error message: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    try {
      await prisma.stripeWebhookEventsLog.create({
        data: {
          eventId: event.id,
          content: JSON.stringify(event),
        },
      });
    } catch (err) {
      console.error("Error logging event: ", err);
    }

    // Successfully constructed event.

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;

        if (typeof paymentIntent.customer !== "string") {
          failWithMessage(res, "Customer id not found");
          console.error("Customer id not found");
          return;
        }

        const costumer = await prisma.stripeCustomer.findUnique({
          where: { stripeCustomerId: paymentIntent.customer },
        });

        if (!costumer) {
          failWithMessage(res, "Customer not found");
          console.error("Customer not found");
          return;
        }

        await prisma.stripePayment.update({
          where: {
            stripeCustomerEmail_paymentId: {
              stripeCustomerEmail: costumer.email,
              paymentId: paymentIntent.id,
            },
          },
          data: { paymentStatus: paymentIntent.status },
        });
        break;
      }
      default: {
        console.warn(`Unhandled event type: ${event.type}`);
        break;
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
};

export default webhookHandler;
