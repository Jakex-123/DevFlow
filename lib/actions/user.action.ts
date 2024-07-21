"use server"
import User from '@/database/user.model';
import { connectDB } from '../mongoose';
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from './shared.types';
import Question from '@/database/question.model';
import { revalidatePath } from 'next/cache';
import { FilterQuery } from 'mongoose';
import Answer from '@/database/answer.model';

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

export async function saveQuestion(params:ToggleSaveQuestionParams){
    try {
        connectDB()
        const {questionId,userId,path}=params
        const user=await User.findById(userId)
        if(!user){
            throw new Error("User not found")
        }
        let updateQuery={};
        if(user.saved.includes(questionId)){
            updateQuery={$pull:{saved:questionId}}
        }
        else{
            updateQuery={$addToSet:{saved:questionId}}
        }
        await User.findByIdAndUpdate(userId,updateQuery,{new:true})

        
        // increment reputation
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getSavedQuestions(params:GetSavedQuestionsParams){
    const {clerkId,searchQuery}=params // ,page,pageSize,filter,searchQuery
    const query:FilterQuery<typeof Question> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, 'i') } }
    : { };
    const user = await User.findOne({clerkId}).populate({
        path:"saved",
        match: query,
        options:{
            sort:{createdAt:-1},
        },
        populate:[
            {path:"tags",model:"Tag",select:"_id name"},
            {path:"author",model:User,select:"_id clerkId name picture"},
        ]
    })

    if(!user){
        throw new Error('User not found')
    }

    const savedQuestions = user.saved
    return {questions:savedQuestions}
}

export async function getUserInfo(params:GetUserByIdParams) {
    try {
        connectDB()
        const {userId}=params
        const user=await User.findOne({clerkId:userId})
        if(!user){
            throw new Error("User Not Found")
        }

        const totalQuestions=await Question.countDocuments({author:user._id})
        const totalAnswers=await Answer.countDocuments({author:user._id})

        return {
            user,
            totalQuestions,
            totalAnswers
          }    

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserQuestions(params:GetUserStatsParams) {
    try{
        connectDB();
        const {userId}=params // ,page=1, pageSize=10
        const totalQuestions = await Question.countDocuments({ author: userId})
        
        const userQuestions= await Question.find({author:userId}).sort({views:-1,upvotes:-1}).populate('tags',"_id name").populate('author',"_id clerkId name picture")
        return {totalQuestions,questions:userQuestions}
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function getUserAnswers(params:GetUserStatsParams) {
    try{
        connectDB();
        const {userId}=params // ,page=1, pageSize=10
        const totalAnswers = await Answer.countDocuments({ author: userId})
        
        const userAnswers= await Answer.find({author:userId}).sort({upvotes:-1}).populate('question',"_id title").populate('author',"_id clerkId name picture")
        return {totalAnswers,answers:userAnswers}
    }
    catch(error){
        console.log(error)
        throw error
    }
}

export async function updateUserInfo(params:UpdateUserParams) {
    try{
        connectDB()
        const {clerkId,path,updateData}=params
        await User.findOneAndUpdate({clerkId},updateData,{new:true})
        revalidatePath(path)
    }
    catch(error){
        console.log(error)
        throw error
    }
}