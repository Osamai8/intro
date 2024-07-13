import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authConfig } from "./auth/[...nextauth]";
import { AddCartBtnType } from "@/types/AddCartBtnType";
import { ProductType } from "@/types/ProductType";
import prisma from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});
const calculateTotalAmount = (items: AddCartBtnType[]) => {
  return items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   get uesr
  const userSession = await getServerSession(req, res, authConfig);

  // await prisma.product.deleteMany({});
  // await prisma.order.deleteMany({});
  // console.log("done");
  // res.status(200).json("done");
  // return;

  if (!userSession) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }
  // cxtract data from body
  const { items, payment_intent_id } = req.body;

  const orderDetails = {
    user: { connect: { id: userSession.user?.id } },
    amount: calculateTotalAmount(items),
    currency: "inr",
    status: "pending",
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map((item: ProductType) => ({
        name: item.name,
        description: item.description,
        unit_amount: parseFloat(item.unit_amount as unknown as string),
        quantity: item.quantity,
        image: item.image,
      })),
    },
  };

  // IF PAYMENT INTENT ID EXISTS THEN UPDATE THE ORDER ELSE CREATE A NEW ONE
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: calculateTotalAmount(items) }
      );
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentID: updated_intent.id },
        include: { products: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid Intent ID" });
      }
      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateTotalAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item: ProductType) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: parseFloat(item.unit_amount as unknown as string),
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
      return;
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateTotalAmount(items),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });
    orderDetails.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma.order.create({ data: orderDetails });

    res.status(200).json({ paymentIntent });
    return;
  }
}
