const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { BOOKING_STATUSES, ERROR_MESSAGES } = require('../common/constants');

const validateBooking = async (req, res, next) => {
  const { customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!customerId || !checkIn || !checkOut || !numberOfGuests || !status || !totalAmount || !roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
      details: 'Thiếu các trường bắt buộc: customerId, checkIn, checkOut, numberOfGuests, status, totalAmount, roomIds (mảng không rỗng)',
    });
  }

  // Kiểm tra định dạng ngày hợp lệ
  if (isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_DATE,
      details: 'checkIn và checkOut phải có định dạng ngày hợp lệ',
    });
  }

  // Kiểm tra checkIn phải trước checkOut
  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_DATE,
      details: 'checkIn phải trước checkOut',
    });
  }

  // Kiểm tra numberOfGuests là số nguyên dương
  if (!Number.isInteger(numberOfGuests) || numberOfGuests <= 0) {
    return res.status(400).json({
      error: 'numberOfGuests phải là số nguyên dương',
    });
  }

  // Kiểm tra totalAmount là số dương
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({
      error: 'totalAmount phải là số dương',
    });
  }

  // Kiểm tra trạng thái hợp lệ
  if (!Object.values(BOOKING_STATUSES).includes(status)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_BOOKING_STATUS,
      details: `status phải là một trong: ${Object.values(BOOKING_STATUSES).join(', ')}`,
    });
  }

  // Kiểm tra phòng có sẵn (nếu bạn có dịch vụ phòng riêng, không cần kiểm tra ở đây)
  // Bỏ qua bước kiểm tra phòng nếu bạn không muốn kiểm tra ở service này
  // Chỉ kiểm tra booking không bị trùng lặp trong khoảng thời gian

  const conflictingBookings = await prisma.bookingRoom.findMany({
    where: {
      roomId: { in: roomIds },
      booking: {
        OR: [
          { checkIn: { lte: new Date(checkOut), gte: new Date(checkIn) } },
          { checkOut: { lte: new Date(checkOut), gte: new Date(checkIn) } },
          { checkIn: { lte: new Date(checkIn) }, checkOut: { gte: new Date(checkOut) } },
        ],
        status: { notIn: [BOOKING_STATUSES.CANCELLED, BOOKING_STATUSES.CHECKED_OUT] },
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

module.exports = validateBooking;
