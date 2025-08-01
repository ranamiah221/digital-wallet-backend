import { model, Schema } from "mongoose";
import { AgentStatus, IUser, Role } from "./user.interface";



const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    agentStatus: { type: String, enum: Object.values(AgentStatus)},
    isVerified: {type:Boolean, default:false},
},
    {
        timestamps: true,
        versionKey: false
    }
)

export const User = model<IUser>("User",userSchema)