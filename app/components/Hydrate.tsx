'use client'
import { useThemeStore } from '@/store';
import React, { ReactNode, useEffect, useState } from 'react'

const Hydrate = ({ children }: { children: ReactNode }) => {
    const [isHydrated, setHydrated] = useState(false);
    const { mode } = useThemeStore();
    useEffect(() => {
        setHydrated(true);
    }, [])
    return (
        <>{isHydrated ? <body className='px-8 lg:px-16 bg-base-100 font-roboto' data-theme={mode}>{children}</body> : <body></body>}</>
    )
}

export default Hydrate;