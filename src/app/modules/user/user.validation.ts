/* eslint-disable no-useless-escape */
import { z } from "zod";


export const createUserZodSchema = z.object({
   email: z.string().email({ message: "Invalid email address format." }),
   password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, { message: "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long" }),
});



