const express = require("express");
const router = express.Router();

// Import controllers
const {
  getAllUsers,
  changeUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
} = require("../controllers/rbacController");

// Import middleware
const { verifyAccessToken, requireAdmin, requireModerator } = require("../middleware/auth");

// @route   GET /api/rbac/users
// @desc    Lấy danh sách tất cả users
// @access  Private (Admin only)
router.get("/users", verifyAccessToken, requireAdmin, getAllUsers);

// @route   PUT /api/rbac/users/:id/role
// @desc    Thay đổi role của user
// @access  Private (Admin only)
router.put("/users/:id/role", verifyAccessToken, requireAdmin, changeUserRole);

// @route   PUT /api/rbac/users/:id/status
// @desc    Kích hoạt/vô hiệu hóa user
// @access  Private (Admin & Moderator)
router.put("/users/:id/status", verifyAccessToken, requireModerator, toggleUserStatus);

// @route   DELETE /api/rbac/users/:id
// @desc    Xóa user
// @access  Private (Admin only)
router.delete("/users/:id", verifyAccessToken, requireAdmin, deleteUser);

// @route   GET /api/rbac/stats
// @desc    Lấy thống kê users theo role
// @access  Private (Admin & Moderator)
router.get("/stats", verifyAccessToken, requireModerator, getUserStats);

module.exports = router;
