'use client'
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import chears from '@/public/giphy.gif';
import { useCartStore } from "@/store"
import Link from 'next/link';

const OrderConfrmed = () => {
    const cartStore = useCartStore();
    useEffect(() => {
        cartStore.setPaymentIntent('');
        cartStore.clearCart();
    }, []);
    return (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            className='flex items-center justify-center my-12'>
            <div className='p-12 text-center'>
                <h1 className='text-xl font-medium'>Your order has been placed 🚀</h1>
                <h1 className='text-sm my-4'>Check your email for receipt</h1>
                <Image src={chears} alt='success-gif' className='py-8' width={400} height={400} />
                <div className="flex items-center justify-center text-gray-600">
                    <Link href={"/dashboard"}>
                        <button className='font-medium'
                            onClick={() => {
                                setTimeout(() => {
                                    cartStore.setCheckout("cart");
                                }, 1000);
                                cartStore.toggleCart();
                            }}>Check your order</button>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default OrderConfrmed;