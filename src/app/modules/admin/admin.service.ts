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

const getAllWallets = async () => {
    const wallet = await Wallet.find().select('_id')
    const totalWallet = await Wallet.countDocuments()
    return {
        data: wallet,
        meta:{
            total:totalWallet
        }
    }
}

const getAllTransactions = async () => {
    const transaction = await Transaction.find().select('_id')
    const totalTransaction = await Transaction.countDocuments()
    return {
        data: transaction,
        meta:{
            total:totalTransaction
        }
    }
}

const blockWallet = async (id: string) => {
    const wallet = await Wallet.findOneAndUpdate({_id:id}, {status:WalletStatus.BLOCKED}, {new: true, runValidators:true})
    if(!wallet){
        throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found")
    }

    return wallet
}
const unBlockWallet = async (id: string) => {
    const wallet = await Wallet.findOneAndUpdate({_id:id}, {status:WalletStatus.ACTIVE}, {new: true, runValidators:true})
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