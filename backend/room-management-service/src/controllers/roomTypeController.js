import roomTypeService from "../services/roomTypeService.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const roomTypeController = {
  // Tạo loại phòng mới
  createRoomType: async (req, res) => {
    try {
      const roomType = await roomTypeService.createRoomType(req);
      res.status(201).json(roomType);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lấy loại phòng theo ID
  getRoomTypeById: async (req, res) => {
    try {
      const roomType = await roomTypeService.getRoomTypeById(req);
      res.status(200).json(roomType);
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },

  // Lấy danh sách tất cả các loại phòng
  getAllRoomTypes: async (req, res) => {
    try {
      const roomTypes = await roomTypeService.getAllRoomTypes();
      res.status(200).json(roomTypes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật loại phòng theo ID
  updateRoomType: async (req, res) => {
    try {
      const updatedRoomType = await roomTypeService.updateRoomType(req);
      if (!updatedRoomType) {
        return res.status(404).json({ error: ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND });
      }
      res.status(200).json(updatedRoomType);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Xóa loại phòng theo ID
  deleteRoomType: async (req, res) => {
    try {
      await roomTypeService.deleteRoomType(req);
      res.status(204).send();
    } catch (error) {
      res.status(error.message.includes(ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND) ? 404 : 500).json({ error: error.message });
    }
  },
};

export default roomTypeController;