import Link from "next/link";
import Stripe from "stripe";
import Product from "./components/Product";

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-04-10",
  });

  const products = await stripe.products.list();

  const productsWithPrice = Promise.all(
    products.data.map(async (product: Stripe.Product) => {
      const prices = await stripe.prices.list({ product: product.id });
      const feature = product.metadata.feature || ""
      return {
        id: product.id,
        name: product.name,
        image: product.images[0],
        currency: prices.data[0].currency,
        unit_amount: prices.data[0].unit_amount,
        description: product.description,
        metadata: { feature },
      };
    })
  );
  return productsWithPrice;
}

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="grid grid-cols-fluid gap-10">
      {products.map((product) => <Product {...product} key={product.id} />)}
    </main>
  );
}
