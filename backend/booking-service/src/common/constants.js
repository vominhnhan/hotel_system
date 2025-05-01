const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
};

const ERROR_MESSAGES = {
  BOOKING_NOT_FOUND: 'Đặt phòng không tồn tại',
  INVALID_BOOKING_STATUS: 'Trạng thái đặt phòng không hợp lệ',
  ROOM_NOT_FOUND: 'Phòng không tồn tại',
  ROOM_ALREADY_BOOKED: 'Phòng đã được đặt trong khoảng thời gian này',
  INVALID_DATE: 'Ngày không hợp lệ',
  MISSING_REQUIRED_FIELDS: 'Thiếu các trường bắt buộc',
};

module.exports = {
  BOOKING_STATUSES,
  ERROR_MESSAGES,
};