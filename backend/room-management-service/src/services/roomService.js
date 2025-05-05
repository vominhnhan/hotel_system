import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";
import { ERROR_MESSAGES, ROOM_STATUSES } from "../common/constants.js";

const roomService = {
  // Tạo phòng mới
  createRoom: async (req) => {
    const { name, type_id, hourly_price, daily_price, overnight_price, description, status, is_cleaned } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !type_id || !description) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Kiểm tra type_id là UUID hợp lệ
    if (!validator.isUUID(type_id)) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }

    // Kiểm tra các giá phải là số dương (nếu có)
    if (hourly_price !== undefined && (typeof hourly_price !== 'number' || hourly_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (daily_price !== undefined && (typeof daily_price !== 'number' || daily_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (overnight_price !== undefined && (typeof overnight_price !== 'number' || overnight_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }

    // Kiểm tra status (nếu có)
    if (status && !Object.values(ROOM_STATUSES).includes(status)) {
      throw new Error(ERROR_MESSAGES.STATUS_NOT_FOUND);
    }

    return await prisma.room.create({
      data: {
        name,
        description,
        type: {
          connect: { id: type_id }, // Kết nối với loại phòng qua type_id
        },
        status: status || ROOM_STATUSES.AVAILABLE, // Mặc định là AVAILABLE
        hourly_price,
        daily_price,
        overnight_price,
        is_cleaned: is_cleaned ?? true, // Mặc định là true nếu không cung cấp
      },
      include: {
        type: true, // Bao gồm thông tin loại phòng
      },
    });
  },

  // Lấy phòng theo ID
  getRoomById: async (req) => {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { type: true },
    });

    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    return room;
  },

  // Lấy tất cả các phòng
  getAllRooms: async () => {
    return await prisma.room.findMany({
      include: { type: true },
    });
  },

  // Cập nhật phòng theo ID
  updateRoom: async (req) => {
    const { id } = req.params;
    const { name, type_id, hourly_price, daily_price, overnight_price, description, status, is_cleaned } = req.body;

    // Kiểm tra xem phòng có tồn tại không
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    // Validate input data
    if (type_id && !validator.isUUID(type_id)) {
      throw new Error(ERROR_MESSAGES.INVALID_UUID);
    }
    if (hourly_price !== undefined && (typeof hourly_price !== 'number' || hourly_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (daily_price !== undefined && (typeof daily_price !== 'number' || daily_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (overnight_price !== undefined && (typeof overnight_price !== 'number' || overnight_price <= 0)) {
      throw new Error(ERROR_MESSAGES.INVALID_PRICE);
    }
    if (status && !Object.values(ROOM_STATUSES).includes(status)) {
      throw new Error(ERROR_MESSAGES.STATUS_NOT_FOUND);
    }

    return await prisma.room.update({
      where: { id },
      data: {
        name,
        description,
        hourly_price,
        daily_price,
        overnight_price,
        status,
        is_cleaned,
        type: type_id ? { connect: { id: type_id } } : undefined,
      },
      include: { type: true },
    });
  },

  // Xóa phòng theo ID
  deleteRoom: async (req) => {
    const { id } = req.params;

    // Kiểm tra xem phòng có tồn tại không
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
    }

    return await prisma.room.delete({ where: { id } });
  },
};

export default roomService;