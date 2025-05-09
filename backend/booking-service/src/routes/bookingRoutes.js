import express from 'express';
import bookingController from '../controllers/bookingController.js';
import validateBooking from '../middlewares/validateBooking.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Route POST để tạo đặt phòng mới
router.post('/', validateBooking, authorizeRoles("MANAGER"), bookingController.createBooking);

// Route GET để lấy tất cả các đặt phòng
router.get('/', bookingController.getAllBookings);

// Route GET để lấy đặt phòng theo ID
router.get('/:id', bookingController.getBookingById);

// Route PUT để cập nhật đặt phòng theo ID
router.put('/:id', authorizeRoles("MANAGER"), bookingController.updateBooking);

// Route DELETE để xóa đặt phòng theo ID
router.delete('/:id', authorizeRoles("MANAGER"), bookingController.deleteBooking);

export default router;