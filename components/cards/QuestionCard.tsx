import React from 'react'
import RenderTag from '../shared/RenderTag'
import Link from 'next/link';
import Metric from '../shared/Metric';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import EditDeleteAction from '../shared/EditDeleteAction';

// const arr=['Javascript','react.js','Invalid Fields','Salesforce'];


interface QuestionProps {
    clerkId?:string,
    _id: string;
    title: string;
    tags: {
        _id: string;
        name: string;
    }[];
    author: {
      _id: string;
      clerkId:string,
      name: string;
      picture: string;
    };
    upvotes: string[];
    views: number;
    answers: Array<object>;
    createdAt: any;
  }

const QuestionCard = ({clerkId,_id,title,tags,author,upvotes,views,answers,createdAt}:QuestionProps) => {
  const showActionButtons=clerkId && clerkId===author.clerkId
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>{getTimeStamp(createdAt)}</span>
                <Link href={`/question/${_id}`}>
                  <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                    {title}
                  </h3>
                </Link>
            </div>
            {showActionButtons && <EditDeleteAction type="question" id={_id.toString()} />}
        </div>
            <div className='mt-3.5 flex flex-wrap gap-2'>
                {tags.map((tag)=>{
                   return <RenderTag key={tag?._id} _id={tag?._id} name={tag?.name}/>
                })}
            </div>
            <div className='mt-6 flex w-full flex-wrap justify-between'>
                <Metric imgUrl={author.picture} title={` • asked ${getTimeStamp(createdAt)}`} alt='user' href={`/profile/${author.clerkId}`} value={author.name} isAuthor textStyles='small-medium text-dark400_light700'/>
                <Metric imgUrl='/assets/icons/like.svg' title='Votes' alt='upvote' value={formatNumber(upvotes.length)} textStyles='small-medium text-dark400_light800'/>
                <Metric imgUrl='/assets/icons/message.svg' title='Answers' alt='answers' value={formatNumber(answers.length)} textStyles='small-medium text-dark400_light800'/>
                <Metric imgUrl='/assets/icons/eye.svg' title='Views' alt='views' value={formatNumber(views)} textStyles='small-medium text-dark400_light800'/>
            </div>

    </div>
    
  )
}

export default QuestionCard