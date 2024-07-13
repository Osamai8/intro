'use client'
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Cart from './Cart';
import { useCartStore } from '@/store';
import { AiFillShopping } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from './ThemeToggle';

const Nav = ({ user }: Session) => {
    const cartStore = useCartStore();
    const closePopup = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
    }
    return (
        <nav className='flex justify-between items-center py-12'>
            <Link href={'/'}>
                <h4 className='font-lobster text-4xl'>Stripe</h4>
            </Link>
            <ul className='flex justify-between items-center gap-8'>
                <li className='flex items-center'><ThemeToggle /></li>
                <li className='text-3xl relative flex items-center cursor-pointer' onClick={cartStore.toggleCart}>
                    <AiFillShopping />
                    <AnimatePresence>
                        {cartStore.cart.length > 0 && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className='text-xs bg-primary text-white rounded-full flex items-center justify-center absolute left-4 bottom-4 h-4 w-4'>
                                {cartStore.cart.length}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </li>
                {!user ? (
                    <li onClick={() => signIn()} className='bg-primary text-white px-4 py-2 cursor-pointer rounded-md'>Sign in</li>
                ) : (
                    <li className='flex items-center'>
                        <div className="dropdown dropdown-bottom dropdown-end cursor-pointer">
                            <Image src={user.image as string} alt={user.name as string} width={36} height={36}
                                className='rounded-full' tabIndex={0} role="button" priority />
                            <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow">
                                <Link href={'/dashboard'}>
                                    <li onClick={closePopup}><span className='py-2 pl-4 rounded-xl'>Orders</span></li>
                                </Link>
                                <li onClick={() => {
                                    signOut();
                                    closePopup();
                                }}><span className='py-2 pl-4 rounded-xl'>Sign out</span></li>
                            </ul>
                        </div>

                    </li>
                )}
            </ul>
            <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
        </nav>
    )
}

export default Nav