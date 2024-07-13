'use client'
import React from 'react';
import { useCartStore } from "@/store"
import Image from 'next/image';
import PriceFormat from '@/utils/PriceFormat';
import { IoAddCircle, IoRemoveCircle, IoClose } from 'react-icons/io5';
import cartimg from '@/public/emptyCart.svg';
import { AnimatePresence, motion } from "framer-motion";
import Checkout from './Checkout';
import OrderConfrmed from './OrderConfrmed';

const Cart = () => {
    const cartStore = useCartStore();
    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed h-screen w-full top-0 left-0 bg-black/25'
            onClick={() => {
                cartStore.setCheckout("cart");
                cartStore.toggleCart();
            }}>
            <motion.div layout onClick={e => e.stopPropagation()}
                className="bg-base-100 text-sm absolute right-0 top-0 w-full sm:w-2/4 lg:w-2/6 h-screen p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    {cartStore.onCheckout === 'cart' && (
                        <h1 className='cursor-pointer' onClick={() => cartStore.toggleCart()}>Back to store 🏃🏻</h1>
                    )}
                    {cartStore.onCheckout === 'checkout' && (
                        <h1 className='cursor-pointer' onClick={() => cartStore.setCheckout("cart")}>Check your cart 🛒</h1>
                    )}
                </div>

                {/* render cart items */}
                {cartStore.onCheckout === 'cart' && (
                    <>
                        {cartStore.cart.map((item) => (
                            <motion.div layout className='flex gap-2 p-2 text-xs bg-base-300 rounded-md my-2' key={item.id}>
                                <Image src={item.image} alt={item.name} width={80} height={80} className='rounded-md' priority />
                                <motion.div layout>
                                    <h2>{item.name}</h2>
                                    <p className='text-sm m-0'>{PriceFormat(item.unit_amount)}</p>
                                    <div className='flex gap-4 mt-2'>
                                        <h2>Quantity: {item.quantity}</h2>
                                        <button><IoRemoveCircle onClick={() => cartStore.removeProduct(item)} /></button>
                                        <button><IoAddCircle onClick={() => cartStore.addProduct(item)} /></button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                        <AnimatePresence>
                            {cartStore.cart.length > 0 && (
                                <motion.div layout>
                                    <p>Total: {PriceFormat(totalPrice)} </p>
                                    <button onClick={() => cartStore.setCheckout('checkout')}
                                        className='w-full btn btn-primary mt-4'>
                                        Checkout
                                    </button>
                                </motion.div>)}
                        </AnimatePresence>
                        <AnimatePresence>
                            {cartStore.cart.length === 0 && (
                                <motion.div
                                    initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
                                    animate={{ scale: 1, rotateZ: 0, opacity: 1 }}
                                    exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
                                    className='flex flex-col items-center gap-14 text-2xl mt-12 font-medium'>
                                    <h1>Oops... it's empty</h1>
                                    <Image src={cartimg} alt='empty cart image' height={200} width={200} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>

                )}
                {/* checkout form */}
                {cartStore.onCheckout === 'checkout' && (<Checkout />)}
                {cartStore.onCheckout === 'success' && (<OrderConfrmed />)}
                {/* 	4000003560000008 */}

            </motion.div>
        </motion.div>
    )
}

export default Cart;