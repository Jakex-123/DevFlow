"use server"
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";


export async function getTopTags(params:GetTopInteractedTagsParams) {
    try {
        connectDB()
        const {userId}=params
        const user=await User.findById(userId)
        if(!user) throw new Error("User Not Found")
        // find interactions
        return ['tag1','tag2','tag3']
    } catch (error) {
        console.log(error)
        throw(error)
    }
}

export async function getAllTags(params:GetAllTagsParams) {
    try{
        connectDB()
        const tags=await Tag.find({})
        return {tags}
    }
    catch(error){
        console.log(error)
        throw(error)
    }
}