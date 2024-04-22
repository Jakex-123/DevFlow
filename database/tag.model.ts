import {Schema, model} from 'mongoose'

export interface Itag extends Document{
    name:string,
    description:string,
    questions:Schema.Types.ObjectId[],
    followers:Schema.Types.ObjectId[],
    createdOn:Date
}

const tagSchema=new Schema<Itag>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    questions:[{
        type:Schema.Types.ObjectId,
        ref:'Question'
    }],
    followers:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    createdOn:{
        type:Date,
        default:Date.now
    }
})

const Tag= model<Itag>('Tag',tagSchema)

export default Tag