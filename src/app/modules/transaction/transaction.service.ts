
import { ITransaction } from "./transaction.interface"
import { Transaction } from "./transaction.model"

const logTransaction = async (data: ITransaction) => {
    return await Transaction.create(data)  
}

export const TransactionService = {
    logTransaction
}