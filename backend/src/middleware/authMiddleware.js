import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ osnovna zaštita – proverava token i dodaje req.user
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // stavi korisnika u req.user
    req.user = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("Protect error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ✅ dodatni sloj – samo admin email iz .env ima pristup
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Admin access only",
  });
};
