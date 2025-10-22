const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require('express-rate-limit');

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

// Advanced RBAC middleware - kiểm tra role và quyền hạn
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Lấy thông tin user từ database để có role mới nhất
      const user = await User.findById(req.user.userId).select("role isActive");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Kiểm tra role có trong danh sách cho phép không
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(
            " or "
          )}. Your role: ${user.role}`,
        });
      }

      // Attach full user info to request
      req.userRole = user.role;
      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during role verification",
      });
    }
  };
};

// Shorthand middleware for common roles
const requireAdmin = checkRole("admin");
const requireModerator = checkRole("admin", "moderator");
const requireUser = checkRole("user", "admin", "moderator");

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 yêu cầu trong khoảng thời gian
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

module.exports = {
  auth,
  adminAuth,
  ownerOrAdminAuth,
  verifyAccessToken,
  checkRole,
  requireAdmin,
  requireModerator,
  requireUser,
  loginRateLimiter,
};
