const validateRoom = (req, res, next) => {
  const { name, type_id, price, description, status } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !type_id || !price || !description) {
    return res.status(400).json({ error: 'Thiếu các trường bắt buộc: name, type_id, price, description' });
  }

  // Kiểm tra price phải là số dương
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'price phải là số dương' });
  }

  // Kiểm tra type_id phải là một UUID hợp lệ
  const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(type_id);
  if (!isValidUUID) {
    return res.status(400).json({ error: 'type_id phải là một UUID hợp lệ' });
  }

  // Kiểm tra status (nếu có) phải nằm trong enum RoomStatus
  const validStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status phải là một trong: AVAILABLE, OCCUPIED, MAINTENANCE' });
  }

  next();
};

module.exports = validateRoom;