import { getUserQuestions } from '@/lib/actions/user.action'
import React from 'react'
import QuestionCard from '../cards/QuestionCard'

interface Props{
    userId:string,
    clerkId:string
}

const QuestionsTab = async ({userId,clerkId}:Props) => {

    const {questions}=await getUserQuestions({userId}) // totalQuestions,
  return (
    <div>
        {questions.map((question)=>(
            <QuestionCard clerkId={clerkId} _id={question._id} key={question._id} author={question.author} createdAt={question.createdAt} answers={question.answers} tags={question.tags} title={question.title} upvotes={question.upvotes} views={question.views} />
        ))}
    </div>
  )
}

export default QuestionsTab