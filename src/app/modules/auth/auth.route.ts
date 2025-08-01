import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post('/register', AuthController.createUser);
router.post('/login', AuthController.credentialLogin);
router.post('/refresh-token', AuthController.getNewAccessToken)
router.post('/logout', AuthController.logout)
router.post('/change-password', checkAuth(...Object.values(Role)), AuthController.changedPassword)

export const AuthRoutes = router