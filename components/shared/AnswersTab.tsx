import { getUserAnswers } from '@/lib/actions/user.action'
import React from 'react'
import AnswerCard from '../cards/AnswerCard'

interface Props{
    userId:string,
    clerkId:string
}

const AnswersTab = async ({userId,clerkId}:Props) => {
    const {totalAnswers,answers}=await getUserAnswers({userId})
    console.log(totalAnswers,answers)
    console.log(answers)
  return (
    <div>
        {answers.map((answer)=>(
            <AnswerCard clerkId={clerkId} question={answer?.question} _id={answer._id} key={answer._id} author={answer.author} createdAt={answer.createdAt} upvotes={answer.upvotes} />
        ))}
    </div>
  )
}

export default AnswersTab