import validator from "validator";
import prisma from "../common/prisma/init.prisma.js";
import { ERROR_MESSAGES, SERVICE_BOOKING_STATUSES } from "../common/constants.js";

const validateService = (req, res, next) => {
  const { name, category, price } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !category || !price) {
    return res.status(400).json({
      error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
      details: 'Thiếu các trường bắt buộc: name, category, price',
    });
  }

  // Kiểm tra price là số dương
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_PRICE,
      details: 'price phải là số dương',
    });
  }

  next();
};

const validateServiceBooking = async (req, res, next) => {
  const { serviceId, customerId, bookingId, quantity, status } = req.body;

  if (!serviceId || !customerId || !quantity) {
    return res.status(400).json({
      error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
      details: 'Thiếu các trường bắt buộc: serviceId, customerId, quantity',
    });
  }

  if (!validator.isUUID(serviceId)) {
    return res.status(400).json({ error: 'serviceId phải là một UUID hợp lệ' });
  }

  if (!validator.isUUID(customerId)) {
    return res.status(400).json({ error: 'customerId phải là một UUID hợp lệ' });
  }

  if (bookingId && !validator.isUUID(bookingId)) {
    return res.status(400).json({ error: 'bookingId phải là một UUID hợp lệ' });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_QUANTITY,
      details: 'quantity phải là số nguyên dương',
    });
  }

  if (status && !Object.values(SERVICE_BOOKING_STATUSES).includes(status)) {
    return res.status(400).json({
      error: ERROR_MESSAGES.INVALID_STATUS,
      details: `status phải là một trong: ${Object.values(SERVICE_BOOKING_STATUSES).join(', ')}`,
    });
  }

  next();
};

export { validateService, validateServiceBooking };