import { Router } from "express";
import { AgentController } from "./agent.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

router.post('/cash-in', checkAuth(Role.AGENT), AgentController.CashIn)
router.post('/cash-out', checkAuth(Role.AGENT),AgentController.CashOut)



export const AgentRoutes = router;