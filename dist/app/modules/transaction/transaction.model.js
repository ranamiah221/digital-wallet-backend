"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
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
    staus: { type: String, enum: Object.values(transaction_interface_1.TransactionStatus), default: transaction_interface_1.TransactionStatus.CONFIRM },
    createdBy: {
        type: String,
        ref: 'User',
        required: true,
    },
    source: { type: String, enum: ['bank', 'mobile_banking'] },
}, { timestamps: true, versionKey: false });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
