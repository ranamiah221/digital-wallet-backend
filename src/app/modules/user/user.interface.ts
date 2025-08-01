import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}
export enum AgentStatus {
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
}


export interface IUser {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: Role;
  agentStatus?: AgentStatus;
  isVerified?: boolean;
  commissionRate?: number; 

}