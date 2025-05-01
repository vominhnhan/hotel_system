const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ERROR_MESSAGES, BOOKING_STATUSES } = require('../common/constants');

// Kiểm tra booking tồn tại
const checkBookingExists = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  if (!booking) {
    throw new Error(ERROR_MESSAGES.BOOKING_NOT_FOUND);
  }
  return booking;
};

const createBooking = async (data) => {
  const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = data;

  // Tạo booking và bookingRooms trong một transaction
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        customerId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        numberOfGuests,
        status,
        totalAmount,
      },
    });

    // Tạo các bản ghi BookingRoom
    const bookingRooms = roomIds.map((roomId) => ({
      bookingId: booking.id,
      roomId,
    }));

    await tx.bookingRoom.createMany({
      data: bookingRooms,
    });

    // Trả về booking với thông tin bookingRooms
    return await tx.booking.findUnique({
      where: { id: booking.id },
      include: { bookingRooms: true },
    });
  });
};

const getBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: { bookingRooms: true },
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: { bookingRooms: true },
    orderBy: { createdAt: 'desc' },
  });
};

const updateBooking = async (id, data) => {
  const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = data;

  return await prisma.$transaction(async (tx) => {
    await checkBookingExists(id);

    // Cập nhật booking
    const updatedBooking = await tx.booking.update({
      where: { id },
      data: {
        customerId,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        numberOfGuests,
        status,
        totalAmount,
      },
    });

    // Nếu có roomIds, xóa các BookingRoom cũ và tạo mới
    if (roomIds && Array.isArray(roomIds)) {
      await tx.bookingRoom.deleteMany({
        where: { bookingId: id },
      });

      const bookingRooms = roomIds.map((roomId) => ({
        bookingId: id,
        roomId,
      }));

      await tx.bookingRoom.createMany({
        data: bookingRooms,
      });
    }

    // Trả về booking với thông tin bookingRooms
    return await tx.booking.findUnique({
      where: { id },
      include: { bookingRooms: true },
    });
  });
};

const deleteBooking = async (id) => {
  await checkBookingExists(id);
  // Vì onDelete: Cascade, xóa Booking sẽ tự động xóa BookingRoom
  return await prisma.booking.delete({
    where: { id },
  });
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
};