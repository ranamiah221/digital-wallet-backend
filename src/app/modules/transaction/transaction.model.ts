import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";



const transactionSchema = new Schema<ITransaction>({
    type: {
        type: String, required: true,
        enum: ['ADD_MONEY', 'WITHDRAW', 'SEND', 'CASH_IN', 'CASH_OUT', 'COMMISSION'],
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
    createdBy: {
        type: String,
        ref: 'User',
        required: true,
    },
}, { timestamps: true, versionKey: false })

export const Transaction = model<ITransaction>("Transaction", transactionSchema)