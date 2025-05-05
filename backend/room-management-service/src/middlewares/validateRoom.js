import validator from "validator";
import { ERROR_MESSAGES, ROOM_STATUSES } from "../common/constants.js";

const validateRoom = (req, res, next) => {
  const {
    name,
    type_id,
    hourly_price,
    daily_price,
    overnight_price,
    description,
    status,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name?.trim() || !type_id?.trim() || !description?.trim()) {
    return res
      .status(400)
      .json({ error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS });
  }

  // Kiểm tra type_id là UUID hợp lệ
  if (!validator.isUUID(type_id)) {
    return res.status(400).json({ error: ERROR_MESSAGES.INVALID_UUID });
  }

  // Kiểm tra các giá phải là số dương (nếu có)
  const priceFields = { hourly_price, daily_price, overnight_price };
  for (const [key, value] of Object.entries(priceFields)) {
    if (value !== undefined && (typeof value !== "number" || value <= 0)) {
      return res.status(400).json({ error: ERROR_MESSAGES.INVALID_PRICE });
    }
  }

  // Kiểm tra status (nếu có)
  if (status && !Object.values(ROOM_STATUSES).includes(status)) {
    return res.status(400).json({
      error: `${ERROR_MESSAGES.STATUS_NOT_FOUND}: status phải là một trong: ${Object.values(
        ROOM_STATUSES
      ).join(", ")}`,
    });
  }

  next();
};

export default validateRoom;
