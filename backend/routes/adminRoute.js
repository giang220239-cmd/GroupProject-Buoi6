const express = require("express");
const router = express.Router();

// Import controllers
const {
  createAdmin,
  getAllUsers,
  deleteUserById,
  updateUserRole,
  getLogs,
} = require("../controllers/adminController");

// Import middleware
const { auth, adminAuth, ownerOrAdminAuth } = require("../middleware/auth");

// @route   POST /api/admin/setup
// @desc    Tạo admin user đầu tiên (chỉ để setup)
// @access  Public (chỉ để setup ban đầu)
router.post("/setup", createAdmin);

// @route   GET /api/admin/users
// @desc    Lấy danh sách tất cả users (Admin only)
// @access  Private (Admin)
router.get("/users", auth, adminAuth, getAllUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Xóa user (Admin hoặc Owner)
// @access  Private (Admin or Owner)
router.delete("/users/:id", auth, ownerOrAdminAuth, deleteUserById);

// @route   PUT /api/admin/users/:id/role
// @desc    Cập nhật role của user (Admin only)
// @access  Private (Admin)
router.put("/users/:id/role", auth, adminAuth, updateUserRole);

// Route to fetch logs for admin
router.get("/logs", auth, adminAuth, getLogs);

module.exports = router;
