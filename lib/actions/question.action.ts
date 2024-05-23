'use server'

import Question from "@/database/question.model";
import { connectDB } from "../mongoose"
import Tag from "@/database/tag.model";

export async function createQuestion({params}:any){
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

    }
    catch(err){

    }
}