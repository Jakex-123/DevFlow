"use server"
import Answer from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
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