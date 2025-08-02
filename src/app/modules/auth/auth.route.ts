import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "../user/user.validation";

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), AuthController.createUser);
router.post('/login', AuthController.credentialLogin);
router.post('/refresh-token', AuthController.getNewAccessToken)
router.post('/logout', AuthController.logout)
router.post('/change-password', checkAuth(...Object.values(Role)), AuthController.changedPassword)


export const AuthRoutes = router