"use server";

import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectDB();
    const {searchQuery,filter,page=1,pageSize=10}=params

    const query:FilterQuery<typeof Question>={}

    if(searchQuery){
      query.$or=[
        {title:{$regex:new RegExp(searchQuery,'i')}},
        {content:{$regex:new RegExp(searchQuery,'i')}},
      ]
    }

    let sortOptions={}

    switch(filter){
      case "newest":
        sortOptions={createdAt:-1}
        break;
      case "frequent":
        sortOptions={views:-1}
        break;
      case "unanswered":
        query.answers={$size:0}
        break;
      default:
      break;
    }

    const skip=(page-1)*pageSize

    const questions = await Question.find(query)
      .populate({ path: "author", model: User })
      .populate({ path: "tags", model: Tag })
      .sort(sortOptions).limit(pageSize).skip(skip);

      const totalQuestions=await Question.countDocuments(query)

      const isNext=totalQuestions>skip+questions.length

    return { questions,isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectDB();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectDB();
    // eslint-disable-next-line no-unused-vars
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      author,
      content,
    });
    let newTags=0;
    const tagDocuments = [];
    for (const tag of tags) {
      let existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${tag}$`, "i") } });
      if(existingTag===null) newTags += 10;

      existingTag=await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $addToSet: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    Interaction.create({
      user:author,
      action:"ask_question",
      question:question._id,
      tags:tagDocuments
    })
    await User.findByIdAndUpdate(author,{$inc:{reputation:(5+newTags)}})
    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $addToSet: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }
    // increment reputation
    if (question.author.toString() !== userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      });
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, userId, hasdownVoted, hasupVoted, path } = params;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $addToSet: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }
    // increment reputation
    if (question.author.toString() !== userId) {
    await User.findByIdAndUpdate(userId,{$inc:{reputation:hasdownVoted?-2:2}})
    await User.findByIdAndUpdate(question.author,{$inc:{reputation:hasdownVoted?-10:10}})
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectDB();
    const { questionId, path } = params;
    await Question.findByIdAndDelete(questionId);
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await User.deleteOne({saved:questionId})
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectDB();
    const { content, path, questionId, title } = params;
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");
    await Question.findByIdAndUpdate(questionId, { title, content });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectDB();
    const questions = await Question.find().sort({ views: -1, upvotes: -1 }).limit(5).select(["_id","title"]);
    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecommendedQuestions(params:RecommendedParams) {
  try {
    connectDB()
    const {userId,page=1,pageSize=10,searchQuery}=params
    const user=await User.findOne({clerkId:userId})
    if(!user){
      throw new Error("No User Found")
    }
    const skip=(page-1)*pageSize;
    const userInteraction=await Interaction.find({user:user._id}).populate('tags').exec()

    const userTags=userInteraction.reduce((tags,interaction)=>{
      if(interaction.tags){
        tags=tags.concat(interaction.tags)
      }
      return tags
    },[])
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  } 
}