import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp=(createdAt:Date):string =>{
  const now = new Date();
  const td=now.getTime()-createdAt.getTime();

  const min=60*1000;
  const hour=60*min;
  const day=24*hour;
  const week=7*day;
  const month=day*30;
  const year=day*365;

  if(td<min){
    const sec=Math.floor(td/1000);
    return `${sec} ${sec===1?'second':'seconds'} ago`
  }
  if(td<hour){
    const mins=Math.floor(td/min);
    return `${mins} ${mins===1?'minute':'minutes'} ago`
  }
  if(td<day){
    const hours=Math.floor(td/hour);
    return `${hours} ${hours===1?'hour':'hours'} ago`
  }
  if(td<week){
    const days=Math.floor(td/day);
    return `${days} ${days===1?'day':'days'} ago`
  }
  if(td<month){
    const weeks=Math.floor(td/week);
    return `${weeks} ${weeks===1?'week':'weeks'} ago`
  }
  if(td<year){
    const months=Math.floor(td/month);
    return `${months} ${months===1?'month':'months'} ago`
  }
  else{
    const years=Math.floor(td/year);
    return `${years} ${years===1?'year':'years'} ago`
  }
}

export const formatNumber=(num:number):string=>{
  if(num>=1e6){
    const formattedNum=(num/1e6).toFixed(1);
    return `${formattedNum}M`
  }
  else if(num>=1e6){
    const formattedNum=(num/1e3).toFixed(1);
    return `${formattedNum}K`
  }
  else{
    return num.toString();
  }
}