"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    const requiredEnvVariable = ["PORT", "DB_URL", "NODE_DEV",
        "BCRYPT_ROUND", "JWT_TOKEN_SECRET", "JWT_EXPIRE_IN", "JWT_REFRESH_TOKEN_SECRET", "JWT_REFRESH_EXPIRE_IN",
        "ADMIN_EMAIL", "ADMIN_PASSWORD"];
    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_DEV: process.env.NODE_DEV,
        BCRYPT_ROUND: process.env.BCRYPT_ROUND,
        JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
        JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_EXPIRE_IN: process.env.JWT_REFRESH_EXPIRE_IN,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    };
};
exports.envVars = loadEnvVariable();
