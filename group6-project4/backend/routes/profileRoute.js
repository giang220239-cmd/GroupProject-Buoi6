const express = require("express");
const router = express.Router();

// Import controllers
const {
  getProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/profileController");

// Import middleware
const { auth } = require("../middleware/auth");
const { updateProfileValidation } = require("../middleware/validation");

// @route   GET /api/profile
// @desc    Lấy thông tin profile của user hiện tại
// @access  Private
router.get("/", auth, getProfile);

// @route   PUT /api/profile
// @desc    Cập nhật thông tin profile của user hiện tại
// @access  Private
router.put("/", auth, updateProfileValidation, updateProfile);

// @route   POST /api/profile/avatar
// @desc    Upload avatar (placeholder)
// @access  Private
router.post("/avatar", auth, uploadAvatar);

module.exports = router;
