"use client";

import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedOut, useAuth } from '@clerk/nextjs';
import React from 'react'
import { Button } from '../ui/button';


const LeftSidebar = () => {
    const pathName=usePathname();
    const {userId}=useAuth();
    return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
        <div className='flex flex-1 flex-col gap-6'>
            {sidebarLinks.map((item)=>{
                const isActive=(pathName.includes(item.route) &&(item.route.length>1)||item.route===pathName);

                if(item.route==='/profile'){
                    if(userId){
                        item.route=`${item.route}/${userId}`
                    }
                    else{
                        return null;
                    }
                }

                return(
                    <Link className={`flex items-center gap-4 bg-transparent p-4 ${isActive?'primary-gradient rounded-lg text-light-900':'text-dark300_light900 justify-start'}`} href={item.route} key={item.label}>
                        <Image src={item.imgURL} width={20} height={20} alt={item.label} className={`${isActive?'':'invert-colors'}`} />
                        <p className={`${isActive?'base-bold':'base-medium'} max-lg:hidden`}>{item.label}</p>
                    </Link>
                )
            })}
        </div>
        <SignedOut>
            <div className='flex flex-col gap-3'>
                <Link href={'/sign-in'}>
                    <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                        <p className='text-primary-500 max-lg:hidden'>Login</p>
                        <Image src={'/assets/icons/account.svg'} alt='login' width={20} height={20} className='invert-colors lg:hidden'/>
                    </Button>
                </Link>
                <Link href={'/sign-up'}>
                    <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none'>
                        <p className='text-dark400_light900 max-lg:hidden'>Sign Up</p>
                        <Image src={'/assets/icons/sign-up.svg'} alt='sign-up' width={20} height={20} className='invert-colors lg:hidden'/>
                    </Button>
                </Link>
            </div>
        </SignedOut>
    </section>
  )
}

export default LeftSidebar