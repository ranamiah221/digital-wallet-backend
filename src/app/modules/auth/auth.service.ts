import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";

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
        throw new AppError(httpStatus.BAD_REQUEST, "Password Does Not Match.")
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest}= user.toObject();
    const JwtPayload = {
        userId:user._id,
        email:user.email,
        role:user.role
    }
    const accessToken = generateToken(JwtPayload, envVars.JWT_TOKEN_SECRET, envVars.JWT_EXPIRE_IN)
    return {
        user:rest,
        accessToken:accessToken
    }

}
export const AuthService = {
   credentialLogin,
   createUser
}