'use client'
import { useCartStore } from '@/store'
import { AddCartBtnType } from '@/types/AddCartBtnType'
import React, { useState } from 'react'

const AddCartBtn = (props: AddCartBtnType) => {
    const cartStore = useCartStore();
    const [added, setAdded] = useState(false);
    const handleAdd = () => {
        cartStore.addProduct(props)
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    }
    return (
        <button className='btn btn-primary my-12'
            disabled={added}
            onClick={handleAdd}>{added ? "Adding to cart " : "Add to cart"}</button>
    )
}

export default AddCartBtn