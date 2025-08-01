import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sandResponse";
import httpStatus from 'http-status-codes'
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookies } from "../../utils/setAuthCookies";


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
   setAuthCookies(res, result)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"User Login Successfully",
        data: result,
    })
    
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token recieved from cookies.")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken)
    setAuthCookies(res, tokenInfo)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })

})
const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out Successfully",
        data: null,
    })

})

const changedPassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const {oldPassword, newPassword}= req.body;
    await AuthService.changedPassword(decodedToken, oldPassword, newPassword)
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Password Changed Successfully",
        data: null,
    })

})

export const AuthController = {
credentialLogin,
createUser,
getNewAccessToken,
logout,
changedPassword
}