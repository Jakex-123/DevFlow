import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import React, { useState } from "react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {

//   const router=useRouter()
// const searchParams=useSearchParams()
// const pathname=usePathname()

//   const query=searchParams.get("filter")
//   const [filter,setFilter]=useState(query || '')


  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 px-5 py-2.5`}
        >
          <div className="line-clamp-1">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup >
            {filters.map((filter) => {
              return (
                <SelectItem
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                  value={filter.value}
                  key={filter.value}
                >
                  {filter.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
