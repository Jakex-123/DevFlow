
import {Schema,model, models} from 'mongoose'

export interface IUser extends Document{
    clerkId: string,
    name:string,
    username:string,
    email:string,
    password?:string,
    bio?:string,
    picture?:string,
    loation?:string,
    portfolioLink?:string,
    reputation?:number,
    saved:Schema.Types.ObjectId[],
    joinedOn:Date
}

const userSchema = new Schema<IUser>({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true,unique:true },
    email: { type: String, required: true,unique:true },
    password: { type: String },
    bio: { type: String },
    picture: { type: String },
    location: { type: String },
    portfolioLink: { type: String },
    reputation: { type: Number, default:0 },
    saved: [{ type: Schema.Types.ObjectId, ref:'Question' }],
    joinedOn: { type: Date, default:Date.now },
  });


 const User= models.User || model<IUser>('User',userSchema)

 export default User;