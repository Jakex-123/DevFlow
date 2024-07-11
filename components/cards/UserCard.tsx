import React from 'react'
import RenderTag from '../shared/RenderTag'
import Image from 'next/image'
import Link from 'next/link'
import { getTopTags } from '@/lib/actions/tag.action'

interface Props{
    user:{
        _id:string,
        clerkId:string,
        picture:string,
        name:string,
        username:string,
    }
}

const UserCard = async ({user}:Props) => {
    const topTags=await getTopTags({userId:user._id})
    return (
    <Link href={`/profiles/${user.clerkId}`} className='background-light900_dark200 flex h-72 w-64 flex-col items-center justify-evenly rounded-2xl shadow-light-100 max-xs:min-w-full sm:w-[260px]'>
        <div className='flex flex-col items-center gap-2'>
            <Image alt="" src={user.picture} className='bg-dark200_light500 rounded-full' width={100} height={100} />
            <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{user.name}</h3>
            <p className='body-regular text-dark500_light500 mt-2'>@{user.username}</p>
        </div>
        <div className='flex items-center gap-2'>
        {topTags.length>0?(topTags.map((tag)=>{
            return <RenderTag key={tag} _id={tag} name={tag.length>4?tag.slice(0,4)+"...":tag}/>
        })):<RenderTag _id={"empty"} name={"No Tags Yet"}/>}
        </div>
        
    </Link>
  )
}

export default UserCard