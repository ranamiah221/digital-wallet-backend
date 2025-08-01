import { Types } from "mongoose";

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

  createdAt?: Date;
  updatedAt?: Date;
}
