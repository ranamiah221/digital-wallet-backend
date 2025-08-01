import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sandResponse";
import httpStatus from 'http-status-codes'
import { AuthService } from "./auth.service";


const createUser = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;
   const result = await AuthService.createUser(payload)
    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"User Created Successfully",
        data: result,
    })
    
})

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
   const {email, password} = req.body;
   const result = await AuthService.credentialLogin(email, password)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User Login Successfully",
        data: result,
    })
    
})

export const AuthController = {
credentialLogin,
createUser
}