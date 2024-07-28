import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RenderTag from './RenderTag';
import { getHotQuestions } from '@/lib/actions/question.action';
import { getHotTags } from '@/lib/actions/tag.action';




const RightSidebar = async() => {
  const hotQuestions = await getHotQuestions()
  const popularTags = await getHotTags()
  console.log(popularTags)
  return (
    <section className='custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <div>
        <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {hotQuestions.map((ques)=>{
            return(<Link
            className='flex cursor-pointer items-center justify-between gap-7'
             href={`/questions/${ques._id}`} key={ques._id}>
              <p className='body-medium text-dark500_light700 '>{ques.title}</p>
              <Image
               className='invert-colors'
               src={'/assets/icons/chevron-right.svg'} width={20} height={20} alt='arrow'/>
            </Link>)
          })}
        </div>
      </div>
      <div>
      <h3 className='h3-bold text-dark200_light900 mt-16'>Popular Tags</h3>
      <div className='mt-7 flex w-full flex-col gap-3'>
        {popularTags.map((tag)=>{
          return(<RenderTag
             _id={tag._id} name={tag.name} key={tag._id}
             totalQuestions={tag.numberOfQuestions}
             showCount={true}
             />)
        })}
      </div>
      </div>
    </section>
  )
}

export default RightSidebar