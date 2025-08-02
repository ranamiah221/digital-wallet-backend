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
exports.AdminService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_interface_1 = require("../wallet/wallet.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllUserOnly = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.USER }).select('-password');
    const totalUser = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.USER });
    return {
        data: users,
        meta: {
            total: totalUser
        }
    };
});
const getAllAgentOnly = () => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.find({ role: user_interface_1.Role.AGENT }).select('-password');
    const totalAgent = yield user_model_1.User.countDocuments({ role: user_interface_1.Role.AGENT });
    return {
        data: agent,
        meta: {
            total: totalAgent
        }
    };
});
const getAllWallets = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const wallet = yield wallet_model_1.Wallet.find().sort(sort).skip(skip).limit(limit).select('userId balance status');
    const totalWallet = yield wallet_model_1.Wallet.countDocuments();
    const meta = {
        page: page,
        limit: limit,
        total: totalWallet,
        totalPage: Math.ceil(totalWallet / limit)
    };
    return {
        meta,
        data: wallet,
    };
});
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const transaction = yield transaction_model_1.Transaction.find().sort(sort).skip(skip).limit(limit).select('_id amount');
    const totalTransaction = yield transaction_model_1.Transaction.countDocuments();
    const meta = {
        page: page,
        limit: limit,
        total: totalTransaction,
        totalPage: Math.ceil(totalTransaction / limit),
    };
    return {
        meta,
        data: transaction,
    };
});
const blockWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId: id }, { status: wallet_interface_1.WalletStatus.BLOCKED }, { new: true, runValidators: true });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found");
    }
    return wallet;
});
const unBlockWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId: id }, { status: wallet_interface_1.WalletStatus.ACTIVE }, { new: true, runValidators: true });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found");
    }
    return wallet;
});
const promoteToAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: id });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    user.role = user_interface_1.Role.AGENT;
    user.status = user_interface_1.AccountStatus.PENDING;
    yield user.save();
    return user;
});
const approveAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findOne({ _id: id });
    if (!agent || agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent Not Found");
    }
    agent.status = user_interface_1.AccountStatus.ACTIVE;
    yield agent.save();
    return agent;
});
const suspendAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.findOne({ _id: id });
    if (!agent || agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent Not Found");
    }
    agent.status = user_interface_1.AccountStatus.SUSPENDED;
    yield agent.save();
    return agent;
});
exports.AdminService = {
    getAllUserOnly,
    getAllAgentOnly,
    getAllWallets,
    getAllTransactions,
    blockWallet,
    unBlockWallet,
    promoteToAgent,
    approveAgent,
    suspendAgent
};
