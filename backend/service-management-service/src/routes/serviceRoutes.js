import express from 'express';
import serviceController from '../controllers/serviceController.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateService, validateServiceBooking } from '../middlewares/validateService.js';

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Routes cho dịch vụ (Service) - Chỉ MANAGER mới được tạo, sửa, xóa
router.post('/', validateService, authorizeRoles("MANAGER"), serviceController.createService);
router.get('/', serviceController.getAllServices); // Cho phép cả MANAGER và EMPLOYEE
router.get('/:id', serviceController.getServiceById); // Cho phép cả MANAGER và EMPLOYEE
router.put('/:id', validateService, authorizeRoles("MANAGER"), serviceController.updateService);
router.delete('/:id', authorizeRoles("MANAGER"), serviceController.deleteService);

// Routes cho đặt dịch vụ (ServiceBooking) - Chỉ MANAGER mới được tạo, xóa
router.post('/bookings', validateServiceBooking, authorizeRoles("MANAGER"), serviceController.createServiceBooking);
router.get('/bookings', serviceController.getAllServiceBookings); // Cho phép cả MANAGER và EMPLOYEE
router.get('/bookings/:id', serviceController.getServiceBookingById); // Cho phép cả MANAGER và EMPLOYEE
router.delete('/bookings/:id', authorizeRoles("MANAGER"), serviceController.deleteServiceBooking);

export default router;