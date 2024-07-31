import { GlobalSearchFilters } from "@/constants/filters";
import { formURLQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
    const searchParams=useSearchParams()
    const router=useRouter()
    const [isActive,setIsActive]=useState('')

    const handleClick=(item:string)=>{
        if(isActive===item){
            setIsActive('')
            const newUrl=formURLQuery({
                params:searchParams.toString(),
                key:'type',
                value:null
            })
            router.push(newUrl,{scroll:false})
        }
        else{
            setIsActive(item)
            const newUrl=formURLQuery({
                params:searchParams.toString(),
                key:'type',
                value:item.toLowerCase()
            })
            router.push(newUrl,{scroll:false})
        }
    }

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
      {GlobalSearchFilters.map((filter) => {
        return (
          <button onClick={()=>{}} onClickCapture={()=>handleClick(filter.value)}
            className={`light-border-2 small-medium ${isActive===filter.value?"bg-primary-500 text-light-900 hover:text-light-900 dark:hover:text-light-900":"background-light700_dark300 text-dark-500 hover:text-primary-500 dark:text-light-900 dark:hover:text-primary-500"}  rounded-2xl px-5 py-2 capitalize `}
            key={filter.value}
          >
            {filter.name}
          </button>
        );
      })}
      </div>
    </div>
  );
};

export default GlobalFilters;
