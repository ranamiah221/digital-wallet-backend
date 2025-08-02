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
exports.AgentService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_service_1 = require("../transaction/transaction.service");
const wallet_model_1 = require("../wallet/wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const CashIn = (decodedToken, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: agentId } = decodedToken;
    const user = yield user_model_1.User.findOne({ _id: agentId });
    if ((user === null || user === void 0 ? void 0 : user.status) === user_interface_1.AccountStatus.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account has been Suspended.");
    }
    const agentWallet = yield wallet_model_1.Wallet.findOne({ userId: agentId });
    if (!agentWallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent Wallet Not Found");
    const userWallet = yield wallet_model_1.Wallet.findOne({ userId: userId });
    if (!userWallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Wallet Not Found");
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
    if (amount <= 0)
        throw new Error('Amount must be greater than zero');
    if (agentWallet.balance < amount)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    agentWallet.balance -= amount;
    yield agentWallet.save();
    userWallet.balance += amount;
    yield userWallet.save();
    yield transaction_service_1.TransactionService.logTransaction({
        type: 'CASH_IN',
        from: agentId,
        to: userId,
        amount,
        createdBy: agentId,
    });
    return {
        userWallet: userWallet,
        agentWallet: agentWallet
    };
});
const CashOut = (decodedToken, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId: agentId } = decodedToken;
    const agent = yield user_model_1.User.findOne({ _id: agentId });
    if ((agent === null || agent === void 0 ? void 0 : agent.status) === user_interface_1.AccountStatus.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account has Suspended.");
    }
    const agentWallet = yield wallet_model_1.Wallet.findOne({ userId: agentId });
    if (!agentWallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent Wallet Not Found");
    const userWallet = yield wallet_model_1.Wallet.findOne({ userId: userId });
    if (!userWallet)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Wallet Not Found");
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked");
    if (amount <= 0)
        throw new Error('Amount must be greater than zero');
    if (userWallet.balance < amount)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    userWallet.balance -= amount;
    yield userWallet.save();
    agentWallet.balance += amount;
    yield agentWallet.save();
    yield transaction_service_1.TransactionService.logTransaction({
        type: 'CASH_OUT',
        from: userId,
        to: agentId,
        amount,
        createdBy: agentId,
    });
    return {
        userWallet: userWallet,
        agentWallet: agentWallet
    };
});
exports.AgentService = {
    CashIn,
    CashOut
};
