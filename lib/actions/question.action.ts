'use server'

import Question from "@/database/question.model";
import { connectDB } from "../mongoose"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

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
                {$setOnInsert:{name:tag}, $push:{ question:question._id}},// do something on it
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