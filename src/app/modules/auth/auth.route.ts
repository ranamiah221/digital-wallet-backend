import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/register', AuthController.createUser);
router.post('/login', AuthController.credentialLogin);

export const AuthRoutes = router