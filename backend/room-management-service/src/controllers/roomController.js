const roomService = require('../services/roomService');
const { ERROR_MESSAGES } = require('../common/constants');

// Tạo phòng mới
const createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy phòng theo ID (có thông tin loại phòng)
const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: ERROR_MESSAGES.ROOM_NOT_FOUND });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách tất cả các phòng (kèm loại phòng)
const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật phòng theo ID
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    if (!updatedRoom) {
      return res.status(404).json({ error: ERROR_MESSAGES.ROOM_NOT_FOUND });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa phòng theo ID
const deleteRoom = async (req, res) => {
  try {
    const deleted = await roomService.deleteRoom(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: ERROR_MESSAGES.ROOM_NOT_FOUND });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
};