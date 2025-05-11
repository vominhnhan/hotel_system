import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Vui lòng cung cấp token để tiếp tục sử dụng",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("token:", token); // Log user ID for debugging

  try { 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token for debugging
    
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
