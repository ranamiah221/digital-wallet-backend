import AppError from "../../errorHelpers/AppError"
import { Transaction } from "../transaction/transaction.model"
import { AccountStatus, Role } from "../user/user.interface"
import { User } from "../user/user.model"
import { WalletStatus } from "../wallet/wallet.interface"
import { Wallet } from "../wallet/wallet.model"
import httpStatus from 'http-status-codes';


const getAllUserOnly = async () => {
    const users = await User.find({role:Role.USER}).select('-password')
    const totalUser = await User.countDocuments({role:Role.USER})
    return {
        data:users,
        meta:{
            total:totalUser
        }
    }
}

const getAllAgentOnly = async () => {
    const agent = await User.find({role:Role.AGENT}).select('-password')
    const totalAgent = await User.countDocuments({role:Role.AGENT})
    return {
        data: agent,
        meta:{
            total:totalAgent
        }
    }
}

const getAllWallets = async (query :Record<string, string>) => {
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit
    const wallet = await Wallet.find().sort(sort).skip(skip).limit(limit).select('userId balance status')
    const totalWallet = await Wallet.countDocuments()
    const meta={
        page:page,
        limit:limit,
        total:totalWallet,
        totalPage:Math.ceil(totalWallet / limit)
    }
    return {
        meta,
        data: wallet,
        
    }
}

const getAllTransactions = async (query :Record<string, string>) => {
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit
    const transaction = await Transaction.find().sort(sort).skip(skip).limit(limit).select('_id amount')
    const totalTransaction = await Transaction.countDocuments()
    const meta = {
        page: page,
        limit:limit,
        total:totalTransaction,
        totalPage:Math.ceil(totalTransaction/limit),
    }
    return {
        meta,
        data: transaction,
        
    }
}

const blockWallet = async (id: string) => {
    const wallet = await Wallet.findOneAndUpdate({userId:id}, {status:WalletStatus.BLOCKED}, {new: true, runValidators:true})
    if(!wallet){
        throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found")
    }

    return wallet
}
const unBlockWallet = async (id: string) => {
    const wallet = await Wallet.findOneAndUpdate({userId:id}, {status:WalletStatus.ACTIVE}, {new: true, runValidators:true})
     if(!wallet){
        throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found")
    }
    return wallet
}

const promoteToAgent = async (id: string) => {
    const user = await User.findOne({_id:id})
     if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    user.role = Role.AGENT;
    user.status = AccountStatus.PENDING;
    await user.save()
    return user;
}

const approveAgent = async (id: string) => {
    const agent = await User.findOne({_id:id})
     if(!agent || agent.role !== Role.AGENT){
        throw new AppError(httpStatus.NOT_FOUND, "Agent Not Found")
    }
    agent.status = AccountStatus.ACTIVE;
    await agent.save()
    return agent;
}
const suspendAgent = async (id: string) => {
     const agent = await User.findOne({_id:id})
     if(!agent || agent.role !== Role.AGENT){
        throw new AppError(httpStatus.NOT_FOUND, "Agent Not Found")
    }
    agent.status = AccountStatus.SUSPENDED;
    await agent.save()
    return agent;
}




export const AdminService = {
    getAllUserOnly,
    getAllAgentOnly,
    getAllWallets,
    getAllTransactions,
    blockWallet,
    unBlockWallet,
    promoteToAgent,
     approveAgent,
   suspendAgent
}