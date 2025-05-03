import prisma from '../common/prisma/init.prisma.js';
import { ERROR_MESSAGES } from '../common/constants.js';
import { BOOKING_STATUSES } from '../common/constants.js'; // Thêm import BOOKING_STATUSES

const bookingService = {
  // Kiểm tra booking tồn tại
  checkBookingExists: async (id) => {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new Error(ERROR_MESSAGES.BOOKING_NOT_FOUND);
    }
    return booking;
  },

  // Kiểm tra status hợp lệ
  checkValidStatus: (status) => {
    if (!Object.values(BOOKING_STATUSES).includes(status)) {
      throw new Error(ERROR_MESSAGES.INVALID_BOOKING_STATUS);
    }
  },

  // Tạo booking mới
  createBooking: async (data) => {
    const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = data;

    bookingService.checkValidStatus(status); 

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

      const bookingRooms = roomIds.map((roomId) => ({
        bookingId: booking.id,
        roomId,
      }));

      await tx.bookingRoom.createMany({
        data: bookingRooms,
      });

      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: { bookingRooms: true },
      });
    });
  },

  // Lấy booking theo ID
  getBookingById: async (id) => {
    return await prisma.booking.findUnique({
      where: { id },
      include: { bookingRooms: true },
    });
  },

  // Lấy tất cả các bookings
  getAllBookings: async (skip = 0, take = 10) => {
    return await prisma.booking.findMany({
      include: { bookingRooms: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  },

  // Cập nhật booking theo ID
  updateBooking: async (id, data) => {
    const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = data;

    bookingService.checkValidStatus(status); 

    return await prisma.$transaction(async (tx) => {
      await bookingService.checkBookingExists(id);


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

      return await tx.booking.findUnique({
        where: { id },
        include: { bookingRooms: true },
      });
    });
  },

  // Xóa booking theo ID
  deleteBooking: async (id) => {
    await this.checkBookingExists(id);
    return await prisma.booking.delete({
      where: { id },
    });
  },
};

export default bookingService;