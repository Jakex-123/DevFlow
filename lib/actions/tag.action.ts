"use server";
import { connectDB } from "../mongoose";
import Tag, { Itag } from "@/database/tag.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function getTopTags(params: GetTopInteractedTagsParams) {
  try {
    connectDB();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User Not Found");
    const userInteraction=await Interaction.find({user:user._id}).populate('tags').exec()

    const userTags=userInteraction.reduce((tags,interaction)=>{
      if(interaction.tags){
        tags=tags.concat(interaction.tags)
      }
      return tags
    },[])
    const distinctUserTags = [
      // @ts-ignore
      ...new Map(userTags.map((tag: any) => [tag._id, tag])).values(),
    ];
    console.log(distinctUserTags)
    return distinctUserTags.length>3 ? distinctUserTags.slice(0,3) : distinctUserTags ;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectDB();
    const {searchQuery,filter,page=1,pageSize=10}=params
    const query:FilterQuery<typeof Tag>={}

    let sortOptions={}

    switch (filter) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "popular":
        sortOptions = { questions: -1 };
        break;
      default:
        break;
    }

    if(searchQuery){
      query.$or=[
        {name:{$regex:new RegExp(searchQuery,'i')}}
      ]
    }
    const skip=(page-1)*pageSize
    const tags = (await Tag.find(query).sort(sortOptions).limit(pageSize).skip(skip));
    const totalTags=await Tag.countDocuments(query)
    const isNext=totalTags>tags.length+skip
    return { tags,isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectDB();

    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;

    const tagFilter: FilterQuery<Itag> = { _id: tagId };
    const skip = (page - 1) * pageSize;

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        limit: pageSize + 1,
        skip
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions.slice(0,pageSize);
    const isNext = tag.questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotTags() {
  try {
    connectDB();
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
