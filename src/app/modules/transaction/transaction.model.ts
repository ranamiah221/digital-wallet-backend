import { model, Schema } from "mongoose";
import { ITransaction, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    type: {
        type: String, required: true,
        enum: ['ADD_MONEY', 'WITHDRAW', 'SEND', 'CASH_IN', 'CASH_OUT'],
    },
    from: {
        type: String,
        ref: 'User',
        required: false,
    },
    to: {
        type: String,
        ref: 'User',
        required: false,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    staus:{type:String, enum:Object.values(TransactionStatus),default:TransactionStatus.CONFIRM},
    createdBy: {
        type: String,
        ref: 'User',
        required: true,
    },
    source: { type: String, enum: ['bank', 'mobile_banking'] },
}, { timestamps: true, versionKey: false })

export const Transaction = model<ITransaction>("Transaction", transactionSchema)