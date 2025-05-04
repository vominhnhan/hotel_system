import { ERROR_MESSAGES } from "../common/constants.js";

const validateRoomType = (req, res, next) => {
  const { name } = req.body;
  if ((req.method === "POST" || req.method === "PUT") && !name) {
    return res.status(400).json({ error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS });
  }
  if (name && typeof name !== 'string') {
    return res.status(400).json({ error: ERROR_MESSAGES.INVALID_ROOM_TYPE_NAME });
  }
  next();
};

export default validateRoomType;