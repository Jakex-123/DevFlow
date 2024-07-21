import React from 'react'
import Link from 'next/link';
import Metric from '../shared/Metric';
import { formatNumber, getTimeStamp } from '@/lib/utils';



interface AnswerProps {
    _id: string;
    title: string;
    author: {
      _id: string;
      name: string;
      picture: string;
    };
    upvotes: string[];
    createdAt: any;
  }

const AnswerCard =({_id,title,author,upvotes,createdAt}:AnswerProps) => {
    
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
        </div>
            <div className='mt-6 flex w-full flex-wrap justify-between'>
                <Metric imgUrl={author.picture} title={` • answered ${getTimeStamp(createdAt)}`} alt='user' href={`/profile/${author._id}`} value={author.name} isAuthor textStyles='small-medium text-dark400_light700'/>
                <Metric imgUrl='/assets/icons/like.svg' title='Votes' alt='upvote' value={formatNumber(upvotes.length)} textStyles='small-medium text-dark400_light800'/>
            </div>

    </div>
    
  )
}

export default AnswerCard