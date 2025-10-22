const express = require("express");
const router = express.Router();

// Import controllers
const {
  signup,
  login,
  logout,
  getMe,
  verifyToken,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authController = require("../controllers/authController");

// Import middleware
const { auth } = require("../middleware/auth");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/validation");
const { loginRateLimiter } = require("../middleware/auth");

// @route   POST /api/auth/signup
// @desc    Đăng ký user mới
// @access  Public
router.post("/signup", signup); // Tạm thời tắt validation để test

// @route   POST /api/auth/login
// @desc    Đăng nhập user
// @access  Public
router.post("/login", loginRateLimiter, login); // Tạm thời tắt validation để test

// @route   POST /api/auth/logout
// @desc    Đăng xuất user
// @access  Private
router.post("/logout", auth, logout);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get("/me", auth, getMe);

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get("/verify", auth, verifyToken);

// @route   POST /api/auth/refresh
// @desc    Refresh Access Token
// @access  Public
router.post("/refresh", refreshAccessToken);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password/:token", resetPassword);

// Register Route
router.post("/register", authController.signup);

// Route đăng ký admin
router.post("/register-admin", authController.registerAdmin);

module.exports = router;
