import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from 'http-status-codes';


export const createUserToken=(user:Partial<IUser>)=>{
     const JwtPayload = {
        userId:user._id,
        email:user.email,
        role:user.role
    }
    const accessToken = generateToken(JwtPayload,envVars.JWT_TOKEN_SECRET,envVars.JWT_EXPIRE_IN)
    const refreshToken = generateToken(JwtPayload,envVars.JWT_REFRESH_TOKEN_SECRET,envVars.JWT_REFRESH_EXPIRE_IN)
    return{
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken =async(refreshToken:string)=>{
const verifiedRefreshToken = verifyToken(refreshToken,envVars.JWT_REFRESH_TOKEN_SECRET) as JwtPayload;

    const isUserExits = await User.findOne({ email: verifiedRefreshToken.email })
    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exits.")
    }
     
    // create a utills function remove dry... 

    const jwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_TOKEN_SECRET,envVars.JWT_EXPIRE_IN)
    return accessToken;
}