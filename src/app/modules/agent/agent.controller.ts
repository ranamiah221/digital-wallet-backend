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
   const decodedToken = req.user
   const {userId, amount}= req.body
   const result = await AgentService.CashOut(decodedToken, userId, amount)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Cash Out Successfully",
        data: result,
    })
    
})

export const AgentController = {
   CashIn,
   CashOut
}