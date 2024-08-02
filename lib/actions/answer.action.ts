"use server";
import Answer from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { connectDB } from "../mongoose";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectDB();
    const { question, author, content, path } = params;
    const answer = await Answer.create({ question, author, content });
    const questionObj=await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    Interaction.create({
      user:author,
      action:"answer",
      question,
      answer:answer._id,
      tags:questionObj.tags
    })
    await User.findByIdAndUpdate(author,{$inc:{reputation:10}})
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectDB();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }
    const skip = (page - 1) * pageSize;
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .limit(pageSize)
      .skip(skip);
    
    const totalAnswers=await Answer.countDocuments({ question: questionId })

    const isNext=totalAnswers>answers.length+skip

    return {answers,isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectDB();
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }
    // increment reputation
    if(answer.author.toString() !== userId){
      await User.findByIdAndUpdate(userId,{$inc:{reputation:hasupVoted?-2:2}})
      await User.findByIdAndUpdate(answer.author,{$inc:{reputation:hasupVoted?-10:10}})
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectDB();
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }
    // increment reputation
    if(answer.author.toString() !== userId){
      await User.findByIdAndUpdate(userId,{$inc:{reputation:hasdownVoted?-2:2}})
      await User.findByIdAndUpdate(answer.author,{$inc:{reputation:hasdownVoted?-10:10}})
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectDB();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }
    await Answer.findByIdAndDelete(answerId);
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
