import { Request, Response } from "express"
import { sendResponse } from "../../utils/sandResponse"
import httpStatus from 'http-status-codes'
import { catchAsync } from "../../utils/catchAsync"
import { UserService } from "./user.service"


const sendMoney = catchAsync(async (req: Request, res: Response) => {
    const decodedToken=req.user;
    const {userId:senderId}=decodedToken;
   const {receiverId, amount}= req.body
   const result = await UserService.sendMoney(senderId, receiverId, amount)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Send Money Successfully",
        data: result,
    })
    
})

const AddMoney = catchAsync(async (req: Request, res: Response) => {
   const decodedToken = req.user;
   const { userId }= decodedToken;
   const {source,  amount}= req.body
   const result = await UserService.AddMoney(userId, amount, source)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Add Money Successfully",
        data: result,
    })
    
})

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
     const decodedToken = req.user;
   const {userId}= decodedToken;
   const { amount, source}= req.body
   const result = await UserService.withdrawMoney(userId, amount, source)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Money Withdraw Successfully",
        data: result,
    })
})

const getUserTransaction = catchAsync(async (req: Request, res: Response) => {
   const decodedToken = req.user;
   const result = await UserService.getUserTransaction(decodedToken)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Get Transaction Successfully",
        data: result,
    })
    
})
const getMe = catchAsync(async (req: Request, res: Response) => {
   const decodedToken = req.user;
   const result = await UserService.getMe(decodedToken)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Get Information Successfully",
        data: result,
    })
    
})



export const UserController = {
   sendMoney,
   AddMoney,
   withdrawMoney,
   getUserTransaction,
   getMe
}