import { model, models, Schema } from "mongoose";

export interface IAnswer extends Document{
    author:Schema.Types.ObjectId,
    question:Schema.Types.ObjectId,
    content:string,
    upvotes:Schema.Types.ObjectId[],
    downvotes:Schema.Types.ObjectId[],
    createdAt:Date
}

const answerSchema=new Schema<IAnswer>({
    author:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    question:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Question"
    },
    content:{
        type:String,
        required:true
    },
    upvotes:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    downvotes:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Answer = models.Answer || model("Answer",answerSchema)

export default Answer
