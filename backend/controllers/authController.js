const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Helper function để tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Helper function để tạo response với token
const sendTokenResponse = async (user, statusCode, res, message) => {
  const accessToken = generateToken(user._id);

  // Tạo refresh token
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  // Lưu refresh token vào database
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
  });

  // Cập nhật lastLogin
  user.lastLogin = new Date();
  await user.save();

  res.status(statusCode).json({
    success: true,
    message: message,
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng. Vui lòng chọn email khác.",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user", // Default role is user
    });

    // Send token response
    sendTokenResponse(user, 201, res, "Đăng ký tài khoản thành công!");
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại trong hệ thống.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo tài khoản.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Đăng nhập user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ admin.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res, "Đăng nhập thành công!");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Đăng xuất user (client sẽ xóa token)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Trong thực tế, với JWT stateless, việc logout chủ yếu do client xử lý
    // Tuy nhiên, chúng ta có thể log việc logout này
    console.log(`User ${req.user.email} logged out at ${new Date()}`);

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng xuất.",
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin user.",
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Token hợp lệ",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi verify token.",
    });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh Token is required",
    });
  }

  try {
    // Verify Refresh Token
    const existingToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new Access Token
    const newAccessToken = generateToken(user._id);
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Forgot Password API
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to database with expiration
    const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await RefreshToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: tokenExpiry,
    });

    // Send email with Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link to reset your password: ${resetURL}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password API
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find token in database
    const tokenRecord = await RefreshToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user and update password
    const user = await User.findById(tokenRecord.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword; // Assume password hashing is handled in the User model
    await user.save();

    // Remove used token
    await RefreshToken.deleteOne({ _id: tokenRecord._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  verifyToken,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
