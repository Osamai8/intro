import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import prisma from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export const config = {
  api: {
    bodyParse: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("No stripe signature found");
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_URL!
    );
  } catch (error) {
    return res.status(400).send("Weebhook error" + error);
  }
  switch (event?.type) {
    case "payment_intent.created":
      const paymentIntent = event.data.object;
      console.log("payment intent was created");
      break;
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      if (typeof charge.payment_intent === "string") {
        try {
          const order = await prisma.order.updateMany({
            where: { paymentIntentID: charge.payment_intent },
            data: { status: "complete" },
          });

          console.log({ order });
        } catch (error) {
          console.log(error);
        }
      }
      break;
    default:
      console.log("Unhandled event type:" + event.type);
      break;
  }
  res.status(200).json({ receive: true });
}
