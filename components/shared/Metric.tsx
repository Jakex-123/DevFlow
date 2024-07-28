import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props{
    imgUrl:string,
    alt:string,
    title:string,
    value:number|string,
    textStyles?:string,
    href?:string,
    isAuthor?:boolean
}



const Metric = ({imgUrl,title,value,textStyles,href,isAuthor,alt}:Props) => {

    const metricContent=(
        <>
        <Image className={`object-cover aspect-square ${href?'rounded-full':''}`} src={imgUrl} height={16} width={16} alt={alt}/>
        <p className={`${textStyles} flex items-center gap-1`}>
            {value}
            <span className={`small-regular line-clamp-1 ${isAuthor?'max-sm:hidden':''}`}>
            {title}
            </span>
        </p>
        </>
    )

    if(href){
        return <Link href={href} className='flex-center gap-1'>
            {metricContent}
        </Link>
    }

  return (
    <div className='flex items-center justify-center gap-1'>
        {metricContent}
    </div>
  )
}

export default Metric