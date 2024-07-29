import { getUserQuestions } from '@/lib/actions/user.action'
import React from 'react'
import QuestionCard from '../cards/QuestionCard'
import Pagination from './Pagination'

interface Props{
    userId:string,
    clerkId:string,
    searchParams:any
}

const QuestionsTab = async ({searchParams,userId,clerkId}:Props) => {
    const {questions,isNext}=await getUserQuestions({userId,page:searchParams?.page ? +searchParams.page:1}) // totalQuestions,
  return (
    <>
        {questions.map((question)=>(
            <QuestionCard clerkId={clerkId} _id={question._id} key={question._id} author={question.author} createdAt={question.createdAt} answers={question.answers} tags={question.tags} title={question.title} upvotes={question.upvotes} views={question.views} />
        ))}
        <div className="mt-10">
        <Pagination pageNumber={searchParams?.page ? +searchParams.page:1} isNext={isNext}/>
        </div>
    </>
  )
}

export default QuestionsTab