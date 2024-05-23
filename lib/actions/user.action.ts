"use server"
import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from './shared.types';
import Question from '@/database/question.model';

export async function getUserById(params:any) {
    try{
        connectDB()
        const {userId}=params;
        const user = await User.findOne({clerkId:userId})
        return user
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function createUser(userData:CreateUserParams) {
    try{
        connectDB();
        const newUser=await User.create(userData)
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function updateUser(userData:UpdateUserParams) {
    try{
        connectDB();
        const {clerkId,updateData,path}=userData
        await User.findOneAndUpdate({clerkId},updateData,{new:true})
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function deleteUser(userid:DeleteUserParams) {
    try{
        connectDB();
        const {clerkId}=userid
        const user=await User.findOneAndDelete({clerkId})
        if(!user){
            throw new Error('User not found')
        }
        //Delete all user data
        const userQuestionsids=await Question.find({author:user._id}).distinct('_id')
        await Question.deleteMany({author:user._id})
        // delete answers
        const deletedUser=await User.findByIdAndDelete(user._id)
        return deletedUser
    }
    catch(error){
        console.log(error)
        throw error
    }
}