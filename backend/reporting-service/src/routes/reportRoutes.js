import express from 'express';
import reportController from '../controllers/reportController.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  '/generate',
  authMiddleware,               // Xác thực token
  authorizeRoles("MANAGER"),      // Kiểm tra vai trò
  reportController.generateReport
);

export default router;
