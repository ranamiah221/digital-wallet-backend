import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}


export interface IUser {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: Role;
  isVerified?: boolean;
  commissionRate?: number; 
  status:AccountStatus
}