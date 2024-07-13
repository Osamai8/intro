import { useCartStore, useThemeStore } from "@/store";
import { StripeElements, StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = () => {
    const cartStore = useCartStore();
    const { mode } = useThemeStore();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
                items: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent
            })
        }).then(res => {
            if (res.status === 403) {
                return router.push('/api/auth/signin')
            }
            return res.json()
        })
            .then(response => {
                console.log(response.paymentIntent)
                setClientSecret(response.paymentIntent.client_secret);
                cartStore.setPaymentIntent(response.paymentIntent.id);
            });
    }, []);
    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: mode === "dark" ? 'night' : "stripe",
            labels: "floating"
        }
    }
    if (!clientSecret) return <OrderAnimation />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} />
            </Elements>
        </motion.div>
    )
}
export default memo(Checkout);