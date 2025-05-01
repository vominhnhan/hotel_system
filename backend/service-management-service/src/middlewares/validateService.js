const { ERROR_MESSAGES } = require('../common/constants');

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

module.exports = validateService;