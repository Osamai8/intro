import { SearchParamTypes } from '@/types/SearchParamsType';
import PriceFormat from '@/utils/PriceFormat';
import Image from 'next/image'
import React from 'react'
import AddCartBtn from './AddCartBtn';

const ProductInfo = async ({ searchParams }: SearchParamTypes) => {
    return (
        <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-24'>
            <Image src={searchParams.image} alt={searchParams.name} height={400} width={400}
                className='w-full h-auto md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]'
                priority />
            <div>
                <div className='font-medium'>
                    <h1 className='text-2xl py-2'>{searchParams.name}</h1>
                    <p className='py-2'>{searchParams.description}</p>
                    <p className='py-2'>{searchParams.feature}</p>
                    <div className="flex gap-2">
                        <p className="font-bold text-primary">{PriceFormat(searchParams.unit_amount)}</p>
                    </div>
                    <AddCartBtn {...searchParams} />
                </div>
            </div>
        </div>
    )
}

export default ProductInfo