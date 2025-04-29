// Middleware kiểm tra vai trò
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập chức năng này" });
    }
    next();
  };
};
