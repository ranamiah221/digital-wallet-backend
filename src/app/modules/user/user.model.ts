import { model, Schema } from "mongoose";
import { AccountStatus, IUser, Role } from "./user.interface";



const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    isVerified: {type:Boolean, default: true},
    status:{type:String, enum:Object.values(AccountStatus), default: undefined}
},
    {
        timestamps: true,
        versionKey: false
    }
)

export const User = model<IUser>("User",userSchema)