import AppError from "../../errorHelpers/AppError"
import httpStatus from 'http-status-codes';
import { Wallet } from "../wallet/wallet.model";
import { TransactionService } from "../transaction/transaction.service";
import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "../transaction/transaction.model";




const sendMoney = async (senderId: string, receiverId: string, amount: number) => {
    if (amount === 0 || amount === null) throw new AppError(httpStatus.BAD_REQUEST, "Added Balance then send money")
    if (senderId === receiverId) throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself")
    const senderWallet = await Wallet.findOne({ userId: senderId })
    const receiverWallet = await Wallet.findOne({ userId: receiverId })
    if (!senderWallet) throw new AppError(httpStatus.NOT_FOUND, "Sender Wallet Not Found")
    if (!receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Reciver Wallet Not Found")
    if (senderWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance")
    }

    senderWallet.balance -= amount;
    await senderWallet.save()
    receiverWallet.balance += amount;
    await receiverWallet.save()

    await TransactionService.logTransaction({
        type: 'SEND',
        from: senderId,
        to: receiverId,
        amount,
        createdBy: senderId,
    })

}

const AddMoney = async (userId: string, amount: number) => {

    const wallet = await Wallet.findOne({ userId: userId })
    if (!wallet) throw new AppError(httpStatus.BAD_REQUEST, "Wallet Not Found")
    if (wallet.status === "BLOCKED") throw new AppError(httpStatus.BAD_REQUEST, 'Wallet is blocked')
    if (amount <= 0) throw new Error('Amount must be greater than zero');

    wallet.balance += amount;
    await wallet.save()

    await TransactionService.logTransaction({
        type: 'ADD_MONEY',
        to: userId,
        amount,
        createdBy: userId,
    })

    return wallet;

}

const withdrawMoney = async (userId: string, amount: number) => {

    const wallet = await Wallet.findOne({ userId: userId })
    if (!wallet) throw new AppError(httpStatus.BAD_REQUEST, "Wallet Not Found")
    if (wallet.status === "BLOCKED") throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked")
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    if (wallet.balance < amount) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    wallet.balance -= amount;
    await wallet.save()

    await TransactionService.logTransaction({
        type: 'WITHDRAW',
        from: userId,
        amount,
        createdBy: userId,
    })
    return wallet;

}

const getUserTransaction = async (decodedToken: JwtPayload) => {

    const transaction = await Transaction.findOne({
        createdBy: decodedToken.userId
    }).select("_id type")
    const totalDocument = await Transaction.countDocuments()
    return {
        data: transaction,
        meta: totalDocument
    }

}

export const UserService = {
    sendMoney,
    AddMoney,
    withdrawMoney,
    getUserTransaction

}