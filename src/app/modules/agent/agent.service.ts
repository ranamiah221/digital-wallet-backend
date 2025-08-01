import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { TransactionService } from "../transaction/transaction.service";
import { Wallet } from "../wallet/wallet.model";
import httpStatus from "http-status-codes";

const CashIn = async (decodedToken:JwtPayload, userId: string, amount: number) => {
     const {userId:agentId}= decodedToken;
    const agentWallet = await Wallet.findOne({ userId: agentId })
    if (!agentWallet) throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet Not Found")
    const userWallet = await Wallet.findOne({ userId: userId })
    if (!userWallet) throw new AppError(httpStatus.BAD_REQUEST, "User Wallet Not Found")
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED") throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked")
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    if (agentWallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    agentWallet.balance -= amount;
    await agentWallet.save()
    userWallet.balance += amount
    await userWallet.save()

    await TransactionService.logTransaction({
        type: 'CASH_IN',
        from: agentId,
        to: userId,
        amount,
        createdBy: agentId,
    })
    return {
        userWallet: userWallet,
        agentWallet: agentWallet
    };

}

const CashOut = async (userId: string, agentId: string, amount: number) => {

    const agentWallet = await Wallet.findOne({ userId: agentId })
    if (!agentWallet) throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet Not Found")
    const userWallet = await Wallet.findOne({ userId: userId })
    if (!userWallet) throw new AppError(httpStatus.BAD_REQUEST, "User Wallet Not Found")
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED") throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked")
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    if (userWallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    userWallet.balance -= amount;
    await userWallet.save()
    agentWallet.balance += amount
    await agentWallet.save()

    await TransactionService.logTransaction({
        type: 'CASH_OUT',
        from: userId,
        to: agentId,
        amount,
        createdBy: userId,
    })
    return {
        userWallet: userWallet,
        agentWallet: agentWallet
    };

}


export const AgentService = {
    CashIn,
    CashOut

}