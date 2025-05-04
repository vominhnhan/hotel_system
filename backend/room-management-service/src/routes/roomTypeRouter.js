import express from 'express';
import roomTypeController from '../controllers/roomTypeController.js';
import validateRoomType from '../middlewares/validateRoomType.js';

const router = express.Router();

// Route POST để tạo loại phòng mới
router.post('/', validateRoomType, roomTypeController.createRoomType);

// Route GET để lấy tất cả các loại phòng
router.get('/', roomTypeController.getAllRoomTypes);

// Route GET để lấy loại phòng theo ID
router.get('/:id', roomTypeController.getRoomTypeById);

// Route PUT để cập nhật loại phòng theo ID
router.put('/:id', validateRoomType, roomTypeController.updateRoomType);

// Route DELETE để xóa loại phòng theo ID
router.delete('/:id', roomTypeController.deleteRoomType);

export default router;