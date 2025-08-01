/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from 'bcrypt'
export const seedAdmin = async()=>{
    try{
        const isAdminExits = await User.findOne({email: envVars.ADMIN_EMAIL})
        if(isAdminExits){
            console.log("Admin already exits");
            return;
        }
       
        const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASSWORD,Number(envVars.BCRYPT_ROUND) )
        
        const payload: IUser ={
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true, 
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const admin = await User.create(payload)
        
    }catch(error){
        console.log(error);
    }
}