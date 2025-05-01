import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import customerController from "../controllers/customer.controller.js";

const customerRouter = express.Router();

customerRouter.use(authMiddleware);

// Lấy danh sách khách hàng
customerRouter.get("/", customerController.getCustomers);

// Lấy thông tin khách hàng theo ID
customerRouter.get("/:id", customerController.getCustomerById);

// Tạo khách hàng mới
customerRouter.post("/", customerController.createCustomer);

// Cập nhật thông tin khách hàng (theo ID)
customerRouter.put("/:id", customerController.updateCustomer);

// Xóa khách hàng theo ID
customerRouter.delete(
  "/:id",
  authorizeRoles("MANAGER"),
  customerController.deleteCustomer
);

export default customerRouter;
