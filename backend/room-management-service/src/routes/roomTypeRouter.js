import express from 'express';
import roomTypeController from '../controllers/roomTypeController.js';
import validateRoomType from '../middlewares/validateRoomType.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Route POST để tạo loại phòng mới
router.post('/', validateRoomType, authorizeRoles("MANAGER"), roomTypeController.createRoomType);

// Route GET để lấy tất cả các loại phòng
router.get('/', roomTypeController.getAllRoomTypes);

// Route GET để lấy loại phòng theo ID
router.get('/:id', roomTypeController.getRoomTypeById);

// Route PUT để cập nhật loại phòng theo ID
router.put('/:id', validateRoomType, authorizeRoles("MANAGER"), roomTypeController.updateRoomType);

// Route DELETE để xóa loại phòng theo ID
router.delete('/:id', authorizeRoles("MANAGER"), roomTypeController.deleteRoomType);

export default router;