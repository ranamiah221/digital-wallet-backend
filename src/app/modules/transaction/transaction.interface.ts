import { Types } from "mongoose";
export enum TransactionStatus{
  PENDING = "PENDING",
  CONFIRM= "CONFIRM",
  FAILED= "FAILED"
}
export type TransactionType =
  | 'ADD_MONEY'     
  | 'WITHDRAW'     
  | 'SEND'          
  | 'CASH_IN'       
  | 'CASH_OUT';   

export interface ITransaction {
  _id?: Types.ObjectId;

  type: TransactionType;

  from?: string;    
  to?: string;      
  amount: number;
  createdBy: string; 
  staus?:TransactionStatus;
  source?: 'bank' | 'mobile_banking';
  createdAt?: Date;
  updatedAt?: Date;
}
