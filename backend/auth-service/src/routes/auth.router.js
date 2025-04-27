import express from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", authController.login);

export default authRouter;
