import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sandResponse"
import { AgentService } from "./agent.service"
import httpStatus from 'http-status-codes';

const CashIn = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
   const {userId, amount}= req.body
   const result = await AgentService.CashIn(decodedToken, userId, amount)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"CashIn Successfully",
        data: result,
    })
    
})

const CashOut = catchAsync(async (req: Request, res: Response) => {
   const {senderId, receiverId, amount}= req.body
   const result = await AgentService.CashOut(senderId, receiverId, amount)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Send Money Successfully",
        data: result,
    })
    
})

export const AgentController = {
   CashIn,
   CashOut
}