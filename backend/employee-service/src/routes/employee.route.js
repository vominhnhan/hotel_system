import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import employeeController from "../controllers/employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.use(authMiddleware);

// Lấy danh sách nhân viên
employeeRouter.get(
  "/",
  authorizeRoles("MANAGER"),
  employeeController.getEmployees
);

// Lấy thông tin nhân viên theo ID
employeeRouter.get("/:id", employeeController.getEmployeeById);

// Tạo nhân viên mới
employeeRouter.post(
  "/",
  authorizeRoles("MANAGER"),
  employeeController.createEmployee
);

// Cập nhật thông tin nhân viên (theo ID)
employeeRouter.put(
  "/:id",
  authorizeRoles("MANAGER"),
  employeeController.updateEmployee
);

// Xóa nhân viên theo ID
employeeRouter.delete(
  "/:id",
  authorizeRoles("MANAGER"),
  employeeController.deleteEmployee
);

export default employeeRouter;
