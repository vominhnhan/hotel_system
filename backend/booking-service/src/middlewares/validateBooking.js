import validator from 'validator';
import { ERROR_MESSAGES, BOOKING_STATUSES } from '../common/constants.js';
import prisma from '../common/prisma/init.prisma.js';

const validateBooking = async (req, res, next) => {
  const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = req.body;

  if (
    !customerId || !checkIn || !checkOut || !numberOfGuests || !status ||
    !totalAmount || !roomIds || !Array.isArray(roomIds) || roomIds.length === 0
  ) {
    return res.status(400).json({
      error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
      details: 'Thiếu các trường bắt buộc: customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds (mảng không rỗng)',
    });
  }

  if (isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_DATE,
      details: 'checkIn và checkOut phải có định dạng ngày hợp lệ',
    });
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_DATE,
      details: 'checkIn phải trước checkOut',
    });
  }

  if (!Number.isInteger(numberOfGuests) || numberOfGuests <= 0) {
    return res.status(400).json({
      error: 'numberOfGuests phải là số nguyên dương',
    });
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({
      error: 'totalAmount phải là số dương',
    });
  }

  if (!Object.values(BOOKING_STATUSES).includes(status)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_BOOKING_STATUS,
      details: `status phải là một trong: ${Object.values(BOOKING_STATUSES).join(', ')}`,
    });
  }

  const conflictingBookings = await prisma.bookingRoom.findMany({
    where: {
      roomId: { in: roomIds },
      booking: {
        OR: [
          { checkIn: { lte: new Date(checkOut), gte: new Date(checkIn) } },
          { checkOut: { lte: new Date(checkOut), gte: new Date(checkIn) } },
          { checkIn: { lte: new Date(checkIn) }, checkOut: { gte: new Date(checkOut) } },
        ],
        status: {
          notIn: [BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.CHECKED_OUT],
        },
      },
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.ROOM_ALREADY_BOOKED,
      details: 'Một hoặc nhiều phòng đã được đặt trong khoảng thời gian này',
    });
  }

  next();
};

export default validateBooking;