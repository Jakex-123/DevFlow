"use client"

import { Input } from '@/components/ui/input'
import { formURLQuery, removeKeysFromQuery } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props{
    route:string,
    iconPosition:string,
    imgSrc:string,
    placeholder:string,
    otherClasses:string
}


const LocalSearch = ({
    route,iconPosition,imgSrc,placeholder,otherClasses
}:Props) => {

const router=useRouter()
const searchParams=useSearchParams()
const pathname=usePathname()


const query=searchParams.get('q')
const [search,setSearch]=useState(query || '')


const handleOnchange=(e:any)=>{
  setSearch(e.target.value)
}

useEffect(()=>{
  const debounce=setTimeout(()=>{
    if(search){
      const newUrl=formURLQuery({
        params:searchParams.toString(),
        key:'q',
        value:search
      })
      router.push(newUrl,{scroll:false})
    }
    else{
      if(pathname===route){
        const newUrl=removeKeysFromQuery({
          params:searchParams.toString(),
          keys:['q']
        })
        router.push(newUrl,{scroll:false})
      }
    }
  },500)
  return ()=>{
    clearTimeout(debounce)
  }
},[search,pathname,searchParams,router,route,query])


  return (
    <div className={`${otherClasses} background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4`}>
      {iconPosition==="left" &&  <Image src={imgSrc} width={24} height={24} className='cursor-pointer ' alt='search icon'/>}
        <Input onChange={handleOnchange} type ="text" className='text-dark400_light700 paragraph-regular placeholder no-focus border-none bg-transparent shadow-none outline-none' placeholder={placeholder}/>
        {iconPosition==="right" &&  <Image src={imgSrc} width={24} height={24} className='cursor-pointer ' alt='search icon'/>}
    </div>
  )
}

export default LocalSearch