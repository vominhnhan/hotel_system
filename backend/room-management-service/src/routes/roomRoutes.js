import express from 'express';
import roomController from '../controllers/roomController.js';
import validateRoom from '../middlewares/validateRoom.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Áp dụng authMiddleware cho tất cả các route
router.use(authMiddleware);

// Route POST để tạo phòng mới
router.post('/', validateRoom, authorizeRoles("MANAGER"), roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', validateRoom, authorizeRoles("MANAGER"), roomController.updateRoom);
router.delete('/:id', authorizeRoles("MANAGER"), roomController.deleteRoom);

export default router;