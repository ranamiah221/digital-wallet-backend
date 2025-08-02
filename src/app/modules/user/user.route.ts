import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post('/send-money', checkAuth(Role.USER), UserController.sendMoney)
router.post('/add-money', checkAuth(Role.USER),UserController.AddMoney)
router.post('/withdraw-money', checkAuth(Role.USER),UserController.withdrawMoney)
router.get('/transaction/me', checkAuth(Role.USER), UserController.getUserTransaction)
router.get('/me', checkAuth(...Object.values(Role)), UserController.getMe)


export const UserRoutes = router;