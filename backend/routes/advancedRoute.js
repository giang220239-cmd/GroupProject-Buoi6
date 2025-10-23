const express = require("express");
const router = express.Router();
const AdvancedController = require("../controllers/advancedController");
const CloudinaryService = require("../services/cloudinaryService");
const { auth } = require("../middleware/auth");
const multer = require("multer");

// Tạo simple multer upload cho testing (không dùng Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(), // Lưu file trong memory
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép upload file ảnh!"), false);
    }
  },
});

// Debug log
console.log("auth type:", typeof auth);
console.log("AdvancedController type:", typeof AdvancedController);
console.log(
  "AdvancedController.uploadAvatar type:",
  typeof AdvancedController.uploadAvatar
);

// Middleware xử lý upload avatar
const handleAvatarUpload = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Avatar upload middleware error:", err);

      // Xử lý các loại lỗi khác nhau
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File quá lớn. Kích thước tối đa 20MB",
        });
      }

      if (err.message === "Chỉ cho phép upload file ảnh!") {
        return res.status(400).json({
          success: false,
          message: "Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp)",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || "Lỗi khi upload file",
      });
    }
    next();
  });
};

// Routes công khai (không cần authentication)
// POST /api/advanced/forgot-password - Quên mật khẩu
router.post("/forgot-password", AdvancedController.forgotPassword);

// POST /api/advanced/reset-password - Đặt lại mật khẩu
router.post("/reset-password", AdvancedController.resetPassword);

// GET /api/advanced/verify-reset-token/:token - Verify reset token
router.get("/verify-reset-token/:token", AdvancedController.verifyResetToken);

// Routes cần authentication
// POST /api/advanced/upload-avatar - Upload avatar
router.post(
  "/upload-avatar",
  auth,
  handleAvatarUpload,
  AdvancedController.uploadAvatar
);

// DELETE /api/advanced/delete-avatar - Xóa avatar
router.delete("/delete-avatar", auth, AdvancedController.deleteAvatar);

module.exports = router;
