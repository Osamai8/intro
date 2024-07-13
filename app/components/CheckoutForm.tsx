import { useCartStore } from '@/store';
import PriceFormat from '@/utils/PriceFormat';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useEffect, FormEvent } from 'react'

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const cartStore = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0);
    useEffect(() => {
        if (!stripe || !clientSecret) return;
    }, [stripe])

    const formSubmitHandler = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!stripe || !elements) return;
        stripe?.confirmPayment({
            elements,
            redirect: 'if_required'
        }).then((result) => {
            if (!result.error) {
                cartStore.setCheckout("success");
            }
            setIsLoading(false);
        })
    }
    return (
        <form id='payment-form' onSubmit={formSubmitHandler}>
            <PaymentElement id='payment-element' options={{ layout: 'tabs' }} />
            <h1 className='font-bold py-4 text-sm'>Total : {PriceFormat(totalPrice)}</h1>
            <button className='w-full btn btn-primary disabled:opacity-25'
                type="submit" disabled={isLoading || !stripe || !elements}>
                {isLoading ? <span>Processing 👀</span> : <span>Pay now 🔥</span>}
            </button>
        </form>
    )
}

export default CheckoutForm;