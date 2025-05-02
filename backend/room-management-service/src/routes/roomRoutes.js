import express from 'express';
import roomController from '../controllers/roomController.js';
import validateRoom from '../middlewares/validateRoom.js';

const router = express.Router();

// Route POST để tạo phòng mới
router.post('/', validateRoom, roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;