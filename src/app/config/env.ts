import dotenv from 'dotenv'

dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_DEV: "development" | "production";
    BCRYPT_ROUND: string;
    JWT_TOKEN_SECRET: string;
    JWT_EXPIRE_IN: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_REFRESH_EXPIRE_IN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
}

const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVariable: string[] = ["PORT", "DB_URL", "NODE_DEV",
        "BCRYPT_ROUND", "JWT_TOKEN_SECRET", "JWT_EXPIRE_IN","JWT_REFRESH_TOKEN_SECRET","JWT_REFRESH_EXPIRE_IN",
        "ADMIN_EMAIL", "ADMIN_PASSWORD"];
    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_DEV: process.env.NODE_DEV as "development" | "production",
        BCRYPT_ROUND: process.env.BCRYPT_ROUND as string,
        JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET as string,
        JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN as string,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        JWT_REFRESH_EXPIRE_IN: process.env.JWT_REFRESH_EXPIRE_IN as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string
    }
}

export const envVars: EnvConfig = loadEnvVariable();