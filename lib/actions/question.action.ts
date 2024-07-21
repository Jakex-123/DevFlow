'use server'

import Question from "@/database/question.model";
import { connectDB } from "../mongoose"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params:GetQuestionsParams) {
    try{
        connectDB();
        const questions=await Question.find({}).populate({path:'author',model:User}).populate({path:'tags', model:Tag})
        return {questions}
    }
    catch(err){
        console.log(err)
        throw(err)
    }
}

export async function getQuestionById(params:GetQuestionByIdParams){
    try {
        connectDB()
        const {questionId}=params
        const question=await Question.findById(questionId).populate({path:'tags',model: Tag, select:'_id name'}).populate({path:'author',model:'User',select:'_id clerkId name picture'})
        return question
    } 
    catch (error) {
        console.log(error)
        throw(error)
    }
}

export async function createQuestion(params:CreateQuestionParams){
    try{
        connectDB();
        // eslint-disable-next-line no-unused-vars
        const {title, content,tags,author,path}=params;

        const question=await Question.create({
            title,author,content
        })

        const tagDocuments=[]
        for (const tag of tags){
            const existingTag=await Tag.findOneAndUpdate(
                {name:{ $regex: new RegExp(`^${tag}$`,"i")}},// find i=case-insensitive
                {$setOnInsert:{name:tag}, $push:{ questions:question._id}},// do something on it
                {upsert: true,new:true}// attributes
            )
            tagDocuments.push(existingTag._id)
        }

        await Question.findByIdAndUpdate(question._id,{
            $push:{tags:{$each:tagDocuments}}
        })
        revalidatePath(path)
    }
    catch(err){
        console.log(err)
        throw(err)
    }
}

export async function upvoteQuestion(params:QuestionVoteParams) {
    try {
        connectDB()
        const {questionId,userId,hasdownVoted,hasupVoted,path}=params
        let updateQuery={};
        if(hasupVoted){
            updateQuery={$pull:{upvotes:userId}}
        }
        else if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId},$addToSet:{upvotes:userId}}
        }
        else{
            updateQuery={$addToSet:{upvotes:userId}}
        }
        const question=await Question.findByIdAndUpdate(questionId,updateQuery,{new:true})

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

export async function downvoteQuestion(params:QuestionVoteParams) {
    try {
        connectDB()
        const {questionId,userId,hasdownVoted,hasupVoted,path}=params
        let updateQuery={};
        if(hasdownVoted){
            updateQuery={$pull:{downvotes:userId}}
        }
        else if(hasupVoted){
            updateQuery={$pull:{upvotes:userId},$addToSet:{downvotes:userId}}
        }
        else{
            updateQuery={$addToSet:{downvotes:userId}}
        }
        const question=await Question.findByIdAndUpdate(questionId,updateQuery,{new:true})

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

export async function deleteQuestion(params:DeleteQuestionParams){
    try{
        connectDB()
        const {questionId,path}=params
        await Question.findByIdAndDelete(questionId)
        await Answer.deleteMany({question:questionId})
        await Interaction.deleteMany({question:questionId})
        await Tag.updateMany({questions:questionId},{$pull:{questions:questionId}})
        revalidatePath(path)
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function editQuestion(params:EditQuestionParams){
    const {content, path, questionId, title}=params
    const question = await Question.findById(questionId)
    if(!question) throw new Error("Question not found")
    await Question.findByIdAndUpdate(questionId,{title,content})
    revalidatePath(path)
}