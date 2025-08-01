import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUser = async (payload: any) => {
    const {password, ...rest}=payload;
    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_ROUND))
    const user = await User.create({
        password: hashedPassword,
        ...rest
    })
    await Wallet.create({
        userId: user._id
    })
    
    return user;
}


const credentialLogin = async (email:string, password:string) => {
    const user = await User.findOne({email:email})
    if(!user){
       throw new AppError(httpStatus.NOT_FOUND,"User Not Found.")
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password.")
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest}= user.toObject();
   const userToken = createUserToken(user)
    return {
        user:rest,
        accessToken:userToken.accessToken,
        refreshToken:userToken.refreshToken,
    }

}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}

const changedPassword = async (decodedToken: JwtPayload, oldPassword:string, newPassword:string) => {
    const user = await User.findById(decodedToken.userId)
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exits")
    }
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Does Not Match")
    }

    user.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_ROUND))
    await user.save()
}
export const AuthService = {
   credentialLogin,
   createUser,
   getNewAccessToken,
   changedPassword
}