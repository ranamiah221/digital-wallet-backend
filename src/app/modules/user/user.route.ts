import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post('/send-money', UserController.sendMoney)
router.post('/add-money', UserController.AddMoney)
router.post('/withdraw-money', UserController.withdrawMoney)
router.get('/transaction',checkAuth(Role.USER), UserController.getUserTransaction)


export const UserRoutes = router