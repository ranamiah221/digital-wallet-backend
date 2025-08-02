"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address format." }),
    password: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, { message: "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long" }),
});
