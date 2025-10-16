const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware xác thực JWT token
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token (bỏ "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid - User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error in authentication.",
    });
  }
};

// Middleware kiểm tra role admin
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
};

// Middleware kiểm tra owner hoặc admin
const ownerOrAdminAuth = (req, res, next) => {
  const userId = req.params.id || req.params.userId;

  if (
    req.user &&
    (req.user._id.toString() === userId || req.user.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message:
        "Access denied. You can only access your own resources or be an admin.",
    });
  }
};

// Middleware kiểm tra Access Token
const verifyAccessToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = {
  auth,
  adminAuth,
  ownerOrAdminAuth,
  verifyAccessToken,
};
