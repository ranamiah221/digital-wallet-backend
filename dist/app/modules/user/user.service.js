"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_service_1 = require("../transaction/transaction.service");
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("./user.model");
const sendMoney = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount === 0 || amount === null)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Added Balance then send money");
    if (senderId === receiverId)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to yourself");
    const senderWallet = yield wallet_model_1.Wallet.findOne({ userId: senderId });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ userId: receiverId });
    if (!senderWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender Wallet Not Found");
    if (!receiverWallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Reciver Wallet Not Found");
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    senderWallet.balance -= amount;
    yield senderWallet.save();
    receiverWallet.balance += amount;
    yield receiverWallet.save();
    yield transaction_service_1.TransactionService.logTransaction({
        type: 'SEND',
        from: senderId,
        to: receiverId,
        amount,
        createdBy: senderId,
    });
});
const AddMoney = (userId, amount, source) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: userId });
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet Not Found");
    if (wallet.status === "BLOCKED")
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Wallet is blocked');
    if (amount <= 0)
        throw new Error('Amount must be greater than zero');
    wallet.balance += amount;
    yield wallet.save();
    yield transaction_service_1.TransactionService.logTransaction({
        type: 'ADD_MONEY',
        to: userId,
        amount,
        source,
        createdBy: userId,
    });
    return wallet;
});
const withdrawMoney = (userId, amount, source) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: userId });
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet Not Found");
    if (wallet.status === "BLOCKED")
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
    if (amount <= 0)
        throw new Error('Amount must be greater than zero');
    if (wallet.balance < amount)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    wallet.balance -= amount;
    yield wallet.save();
    yield transaction_service_1.TransactionService.logTransaction({
        type: 'WITHDRAW',
        from: userId,
        amount,
        source,
        createdBy: userId,
    });
    return wallet;
});
const getUserTransaction = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.find({
        createdBy: decodedToken.userId
    }).select("_id type createdBy");
    const totalDocument = yield transaction_model_1.Transaction.countDocuments({ createdBy: decodedToken.userId });
    return {
        data: transaction,
        meta: {
            total: totalDocument
        }
    };
});
const getMe = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        _id: decodedToken.userId
    }).select("-password");
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: decodedToken.userId }).select("-_id");
    return {
        user, wallet
    };
});
exports.UserService = {
    sendMoney,
    AddMoney,
    withdrawMoney,
    getUserTransaction,
    getMe
};
