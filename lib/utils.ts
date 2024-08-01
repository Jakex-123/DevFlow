import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string"
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};


export const formatNumber=(num:number):string=>{
  if(num>=1e6){
    const formattedNum=(num/1e6).toFixed(1);
    return `${formattedNum}M`
  }
  else if(num>=1e3){
    const formattedNum=(num/1e3).toFixed(1);
    return `${formattedNum}K`
  }
  else{
    return num.toString();
  }
}

interface URLQueryParams{
  params:string,
  key:string,value:string | null
}

export const formURLQuery=({params,key,value}:URLQueryParams)=>{
  const currUrl=qs.parse(params)
  currUrl[key]=value
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currUrl
    },
    {
      skipNull: true
    }
  )
}

interface URLRemoveQueryParams{
  params:string;
  keys:string[];
}

export const removeKeysFromQuery = ({ params, keys }: URLRemoveQueryParams) => {
  const currUrl = qs.parse(params);
  keys.forEach((key) => delete currUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currUrl
    },
    {
      skipNull: true
    }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[]
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  }

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if(count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] +=1 ;
      }
    })
  })

  return badgeCounts;
}