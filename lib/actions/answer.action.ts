"use server"
import Answer from "@/database/answer.model";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { connectDB } from "../mongoose";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectDB();
    const { question, author, content, path } = params;
    const answer = await Answer.create({ question, author, content });
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async(params:GetAnswersParams)=>{
    try {
        connectDB()
        const {questionId}=params
        const answers=await Answer.find({question:questionId}).populate("author","_id clerkId name picture").sort({createdAt:-1})
        return answers
    } catch (error) {
        console.log(error)
        throw(error)
    }
} 

export async function upvoteAnswer(params:AnswerVoteParams) {
  try {
      connectDB()
      const {answerId,userId,hasdownVoted,hasupVoted,path}=params
      let updateQuery={};
      if(hasupVoted){
          updateQuery={$pull:{upvotes:userId}}
      }
      else if(hasdownVoted){
          updateQuery={$pull:{downvotes:userId},$push:{upvotes:userId}}
      }
      else{
          updateQuery={$addToSet:{upvotes:userId}}
      }
      const question=await Answer.findByIdAndUpdate(answerId,updateQuery,{new:true})

      if(!question){
          throw new Error("Question not found")
      }
      // increment reputation
      revalidatePath(path)
  } catch (error) {
      console.log(error)
      throw error
  }
}

export async function downvoteAnswer(params:AnswerVoteParams) {
  try {
      connectDB()
      const {answerId,userId,hasdownVoted,hasupVoted,path}=params
      let updateQuery={};
      if(hasdownVoted){
          updateQuery={$pull:{downvotes:userId}}
      }
      else if(hasupVoted){
          updateQuery={$pull:{upvotes:userId},$push:{downvotes:userId}}
      }
      else{
          updateQuery={$addToSet:{downvotes:userId}}
      }
      const question=await Answer.findByIdAndUpdate(answerId,updateQuery,{new:true})

      if(!question){
          throw new Error("Question not found")
      }
      // increment reputation
      revalidatePath(path)
  } catch (error) {
      console.log(error)
      throw error
  }
}