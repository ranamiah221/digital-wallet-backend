import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = Router()

router.get('/users', checkAuth(Role.ADMIN), AdminController.getAllUserOnly);
router.get('/agents', checkAuth(Role.ADMIN), AdminController.getAllAgentOnly);
router.get('/wallets', checkAuth(Role.ADMIN), AdminController.getAllWallets);
router.get('/transactions', checkAuth(Role.ADMIN), AdminController.getAllTransactions );

router.patch('/block-wallet/:id', checkAuth(Role.ADMIN), AdminController.blockWallet);
router.patch('/unblock-wallet/:id', checkAuth(Role.ADMIN), AdminController.unBlockWallet);

router.patch('/promote-agent/:id', checkAuth(Role.ADMIN), AdminController.promoteToAgent);
router.patch('/approve-agent/:id', checkAuth(Role.ADMIN), AdminController.approveAgent);
router.patch('/suspend-agent/:id', checkAuth(Role.ADMIN), AdminController.suspendAgent);

export const AdminRoutes = router;