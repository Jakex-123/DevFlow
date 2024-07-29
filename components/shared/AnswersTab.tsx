import { getUserAnswers } from '@/lib/actions/user.action'
import React from 'react'
import AnswerCard from '../cards/AnswerCard'
import Pagination from './Pagination'

interface Props{
    userId:string,
    clerkId:string,
    searchParams:any
}

const AnswersTab = async ({userId,clerkId,searchParams}:Props) => {
    const {answers,isNext}=await getUserAnswers({userId,page:searchParams?.page ? +searchParams.page:1})
    
  return (
    <>
        {answers.map((answer)=>(
            <AnswerCard clerkId={clerkId} question={answer?.question} _id={answer._id} key={answer._id} author={answer.author} createdAt={answer.createdAt} upvotes={answer.upvotes} />
        ))}
        <div className="mt-10">
        <Pagination pageNumber={searchParams?.page ? +searchParams.page:1} isNext={isNext}/>
        </div>
    </>
  )
}

export default AnswersTab