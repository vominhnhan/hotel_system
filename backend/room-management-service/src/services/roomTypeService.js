import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";
import { ERROR_MESSAGES } from "../common/constants.js";

const roomTypeService = {
  // Tạo loại phòng mới
  createRoomType: async (req) => {
    const { name } = req.body;

    // Kiểm tra trường bắt buộc
    if (!name) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra tên loại phòng không trùng
    const existingRoomType = await prisma.roomType.findFirst({
      where: { name },
    });
    if (existingRoomType) {
      throw new Error(ERROR_MESSAGES.ROOM_TYPE_ALREADY_EXISTS);
    }

    return await prisma.roomType.create({
      data: {
        name,
      },
    });
  },

  // Lấy loại phòng theo ID
  getRoomTypeById: async (req) => {
    const { id } = req.params;

    // Kiểm tra ID là UUID hợp lệ
    if (!validator.isUUID(id)) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: { rooms: true }, // Bao gồm danh sách phòng liên quan
    });

    if (!roomType) {
      throw new Error(ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND);
    }

    return roomType;
  },

  // Lấy tất cả các loại phòng
  getAllRoomTypes: async () => {
    return await prisma.roomType.findMany({
      include: { rooms: true }, // Bao gồm danh sách phòng liên quan
    });
  },

  // Cập nhật loại phòng theo ID
  updateRoomType: async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    // Kiểm tra ID là UUID hợp lệ
    if (!validator.isUUID(id)) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }

    // Kiểm tra xem loại phòng có tồn tại không
    const roomType = await prisma.roomType.findUnique({ where: { id } });
    if (!roomType) {
      throw new Error(ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND);
    }

    // Kiểm tra tên mới không trùng (nếu có thay đổi tên)
    if (name && name !== roomType.name) {
      const existingRoomType = await prisma.roomType.findFirst({
        where: { name },
      });
      if (existingRoomType) {
        throw new Error(ERROR_MESSAGES.ROOM_TYPE_ALREADY_EXISTS);
      }
    }

    return await prisma.roomType.update({
      where: { id },
      data: {
        name,
      },
      include: { rooms: true }, // Bao gồm danh sách phòng liên quan
    });
  },

  // Xóa loại phòng theo ID
  deleteRoomType: async (req) => {
    const { id } = req.params;

    // Kiểm tra ID là UUID hợp lệ
    if (!validator.isUUID(id)) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }

    // Kiểm tra xem loại phòng có tồn tại không
    const roomType = await prisma.roomType.findUnique({ where: { id } });
    if (!roomType) {
      throw new Error(ERROR_MESSAGES.ROOM_TYPE_NOT_FOUND);
    }

    // Kiểm tra xem loại phòng có phòng liên quan không
    const relatedRooms = await prisma.room.count({
      where: { type_id: id },
    });
    if (relatedRooms > 0) {
      throw new Error(ERROR_MESSAGES.ROOM_TYPE_HAS_ROOMS);
    }

    return await prisma.roomType.delete({ where: { id } });
  },
};

export default roomTypeService;