"use server"
import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
      await connectDB();
      const { questionId, userId } = params;
  
      await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 }});
      let existingInteraction;
      if(userId) {
        existingInteraction = await Interaction.findOne({ 
          user: userId,
          action: "view",
          question: questionId,
    })
        if(existingInteraction) return console.log('User has already viewed.')
  
        await Interaction.create({
          user: userId,
          action: "view",
          question: questionId,
        })
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  export async function viewTag(params: { tagId: any; userId: any }) {
    try {
      await connectDB();
      const { tagId, userId } = params;
  
      if (userId) {
        // Find existing interaction
        const existingInteraction = await Interaction.findOne({
          user: userId,
          action: "view_tag",
          tags: tagId,
        });
  
        if (existingInteraction) {
          console.log('User has already viewed this tag.');
          return;
        }
  
        // Create a new interaction record or update an existing one
        await Interaction.updateOne(
          { user: userId, action: "view_tag" },
          { $addToSet: { tags: tagId } }, // Use $addToSet to avoid duplicates
          { upsert: true } // Create a new document if none exists
        );
      }
    } catch (error) {
      console.error('Error in viewTag function:', error);
      throw error;
    }
  }