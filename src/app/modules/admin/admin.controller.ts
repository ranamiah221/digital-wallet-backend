import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { AdminService } from "./admin.service"
import { sendResponse } from "../../utils/sandResponse"
import httpStatus from 'http-status-codes';

const getAllUserOnly = catchAsync(async (req: Request, res: Response) => {
   const result = await AdminService.getAllUserOnly()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Retrived All User Successfully",
        data: result,
    })
    
})

const getAllAgentOnly = catchAsync(async (req: Request, res: Response) => {
   const result = await AdminService.getAllAgentOnly()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Retrived All Agent Successfully",
        data: result,
    })
    
})

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
   const result = await AdminService.getAllWallets()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Retrived All Wallet Successfully",
        data: result,
    })
    
})

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
   const result = await AdminService.getAllTransactions()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Retrived All Transaction Successfully",
        data: result,
    })
    
})

const blockWallet = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
   const result = await AdminService.blockWallet(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Wallet Block Successfully",
        data: result,
    })
    
})

const unBlockWallet = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
   const result = await AdminService.unBlockWallet(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Wallet Unblock Successfully",
        data: result,
    })
    
})
const promoteToAgent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
   const result = await AdminService.promoteToAgent(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User Promote to Agent Successfully",
        data: result,
    })
    
})

const approveAgent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
   const result = await AdminService.approveAgent(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Agent Approve Successfully",
        data: result,
    })
    
})

const suspendAgent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
   const result = await AdminService.suspendAgent(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Agent Suspend Successfully",
        data: result,
    })
    
})


export const AdminController = {
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