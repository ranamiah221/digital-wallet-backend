import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes';
import { User } from "../modules/user/user.model";
import { NextFunction, Request, Response } from "express";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = await req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "Access Token Not Found")
        }
        const verifiedToken = await verifyToken(accessToken, envVars.JWT_TOKEN_SECRET) as JwtPayload

        const isUserExits = await User.findOne({ email: verifiedToken.email })
        if (!isUserExits) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exits.")
        }
        
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted this route.")
        }

        req.user = verifiedToken;

        next()
    } catch (error) {
        next(error)
    }
}