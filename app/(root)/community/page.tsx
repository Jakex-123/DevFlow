import UserCard from '@/components/cards/UserCard'
import Filter from '@/components/shared/Filter'
import LocalSearch from '@/components/shared/search/LocalSearch'
import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import React from 'react'


const Page =async () => {
  const res=await getAllUsers({})
  return <div className='mx-auto w-full max-w-5xl'>
  <div>
    <h1 className='h1-bold text-dark100_light900'>All Users</h1>
  </div>
  <div className='mt-11 flex flex-wrap justify-between gap-5'>
    <LocalSearch 
    route='/community' 
    iconPosition='left' 
    imgSrc='/assets/icons/search.svg' 
    placeholder={'Search amazing minds here...'}
    otherClasses={'flex-1'}
    />
    <Filter filters={UserFilters}   otherClasses="min-h-[56px] sm:min-w-[170px]" />
  </div>
  <section className='mt-11 flex flex-wrap gap-4'>
  {res.users.length>0 ?( res.users.map((user)=>{
    return <UserCard key={user} user={user} />;
  })):("no users")}
  </section>
  </div>
}

export default Page