import roomService from "../services/roomService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const roomController = {
  // Tạo phòng mới
  createRoom: async (req, res) => {
    try {
      const room = await roomService.createRoom(req);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy phòng theo ID
  getRoomById: async (req, res) => {
    try {
      const room = await roomService.getRoomById(req);
      res.status(200).json(room);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.ROOM_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy danh sách tất cả các phòng
  getAllRooms: async (req, res) => {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật phòng theo ID
  updateRoom: async (req, res) => {
    try {
      const updatedRoom = await roomService.updateRoom(req);
      if (!updatedRoom) {
        return res.status(404).json({ error: ERROR_MESSAGES.ROOM_NOT_FOUND });
      }
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Xóa phòng theo ID
  deleteRoom: async (req, res) => {
    try {
      await roomService.deleteRoom(req);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.ROOM_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },
};

export default roomController;