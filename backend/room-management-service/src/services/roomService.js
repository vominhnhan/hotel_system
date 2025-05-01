const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES, ROOM_STATUSES } = require('../common/constants');

// Tạo phòng mới
const createRoom = async (data) => {
  // Validate status
  if (data.status && !Object.values(ROOM_STATUSES).includes(data.status)) {
    throw new Error(ERROR_MESSAGES.STATUS_NOT_FOUND);
  }

  // Validate các trường bắt buộc
  if (!data.name || !data.type_id || !data.price || !data.description) {
    throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
  }

  return await prisma.room.create({
    data: {
      name: data.name,
      description: data.description,
      type: {
        connect: { id: data.type_id }, // Kết nối với loại phòng qua type_id
      },
      status: data.status || ROOM_STATUSES.AVAILABLE, // Mặc định là AVAILABLE
      price: data.price,
      is_cleaned: data.is_cleaned ?? true, // Mặc định là true nếu không cung cấp
    },
    include: {
      type: true, // Bao gồm thông tin loại phòng
    },
  });
};

// Lấy phòng theo ID
const getRoomById = async (id) => {
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      type: true,
    },
  });

  if (!room) {
    throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
  }

  return room;
};

// Lấy tất cả các phòng
const getAllRooms = async () => {
  return await prisma.room.findMany({
    include: {
      type: true,
    },
  });
};

// Cập nhật phòng theo ID
const updateRoom = async (id, data) => {
  const roomExists = await prisma.room.findUnique({
    where: { id },
  });

  if (!roomExists) {
    throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
  }

  // Validate status
  if (data.status && !Object.values(ROOM_STATUSES).includes(data.status)) {
    throw new Error(ERROR_MESSAGES.STATUS_NOT_FOUND);
  }

  return await prisma.room.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      status: data.status,
      is_cleaned: data.is_cleaned,
      type: data.type_id ? {
        connect: { id: data.type_id }, // Kết nối lại loại phòng nếu có type_id
      } : undefined,
    },
    include: {
      type: true, // Bao gồm thông tin loại phòng
    },
  });
};

// Xóa phòng theo ID
const deleteRoom = async (id) => {
  const roomExists = await prisma.room.findUnique({
    where: { id },
  });

  if (!roomExists) {
    throw new Error(ERROR_MESSAGES.ROOM_NOT_FOUND);
  }

  return await prisma.room.delete({
    where: { id },
  });
};

module.exports = {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
};