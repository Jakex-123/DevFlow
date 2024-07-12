"use server"
import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams } from './shared.types';
import Question from '@/database/question.model';

export async function getAllUsers(params:GetAllUsersParams) {
    try{
        connectDB();
        // eslint-disable-next-line no-unused-vars
        const {page=1, pageSize=10, filter,searchQuery}=params
        const users=await User.find({}).sort({createdAt:-1})
        return {users};
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function getUserById(params:GetUserByIdParams) {
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
        return newUser
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function updateUser(userData:UpdateUserParams) {
    try{
        connectDB();
        // eslint-disable-next-line no-unused-vars
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
        // Delete all user data
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