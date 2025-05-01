const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const validateRoom = require('../middlewares/validateRoom');

// Route POST để tạo phòng mới
router.post('/', validateRoom, roomController.createRoom);

// Route GET để lấy tất cả các phòng
router.get('/', roomController.getAllRooms);

// Route GET để lấy thông tin chi tiết một phòng theo ID
router.get('/:id', roomController.getRoomById);

// Route PUT để cập nhật thông tin phòng theo ID
router.put('/:id', validateRoom, roomController.updateRoom);

// Route DELETE để xóa một phòng theo ID
router.delete('/:id', roomController.deleteRoom);

module.exports = router;