const User = require("../models/User");
const emailService = require("../services/emailService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class AdvancedController {
  // API Forgot Password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập email",
        });
      }

      // Tìm user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tài khoản với email này",
        });
      }

      // Kiểm tra user có active không
      if (!user.isActive) {
        return res.status(400).json({
          success: false,
          message: "Tài khoản đã bị vô hiệu hóa",
        });
      }

      // Tạo reset password token
      const resetToken = user.getResetPasswordToken();

      // Lưu user với token
      await user.save({ validateBeforeSave: false });

      // Cố gắng gửi email, nhưng không fail nếu lỗi (for testing)
      try {
        await emailService.sendResetPasswordEmail(
          user.email,
          resetToken,
          user.name
        );
        console.log("✅ Email sent successfully");
      } catch (emailError) {
        console.log(
          "⚠️ Email service not configured, but token created for testing"
        );
        console.error("Email error:", emailError.message);
      }

      // Trả về success dù email có gửi được hay không
      res.status(200).json({
        success: true,
        message:
          "Email hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn (hoặc token đã được tạo để test)",
        data: {
          email: user.email,
          resetTokenExpire: user.resetPasswordExpire,
          // Thêm resetToken để test dễ hơn (chỉ trong dev)
          resetToken:
            process.env.NODE_ENV === "development" ? resetToken : undefined,
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi xử lý yêu cầu",
      });
    }
  }

  // API Reset Password
  static async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      // Validate input
      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu xác nhận không khớp",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        });
      }

      // Hash token để so sánh
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Tìm user với token và kiểm tra expiry
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      }).select("+password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        });
      }

      // Cập nhật mật khẩu mới
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      // Gửi email thông báo
      try {
        await emailService.sendPasswordChangedEmail(user.email, user.name);
      } catch (emailError) {
        console.error("Send password changed email error:", emailError);
        // Không throw error vì đây không phải critical function
      }

      res.status(200).json({
        success: true,
        message:
          "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới",
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi đặt lại mật khẩu",
      });
    }
  }

  // API Upload Avatar - Modified for testing without Cloudinary
  static async uploadAvatar(req, res) {
    try {
      const userId = req.user.id;

      // Kiểm tra có file upload không
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn file ảnh để upload",
        });
      }

      console.log("📁 File uploaded:", {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      // Tìm user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }

      // Tạo mock avatar URL for testing (placeholder image with user name)
      const mockAvatarUrl = `https://via.placeholder.com/300x300/667eea/ffffff?text=${encodeURIComponent(
        user.name.charAt(0).toUpperCase()
      )}`;
      const mockPublicId = `mock_avatar_${userId}_${Date.now()}`;

      // Cập nhật avatar mới với mock data
      user.avatar = {
        url: mockAvatarUrl,
        publicId: mockPublicId,
      };

      await user.save();

      console.log("✅ Avatar updated successfully with mock URL");

      res.status(200).json({
        success: true,
        message:
          "Upload avatar thành công! (Test mode - sử dụng ảnh placeholder)",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Upload avatar error:", error);

      res.status(500).json({
        success: false,
        message: "Lỗi server khi upload avatar",
      });
    }
  }

  // API Delete Avatar
  static async deleteAvatar(req, res) {
    try {
      const userId = req.user.id;

      // Tìm user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy user",
        });
      }

      // Kiểm tra có avatar không
      if (!user.avatar || !user.avatar.url) {
        return res.status(400).json({
          success: false,
          message: "User chưa có avatar để xóa",
        });
      }

      // Skip Cloudinary deletion in test mode
      console.log(
        "🗑️ Deleting avatar (test mode - no Cloudinary deletion needed)"
      );

      // Xóa avatar từ database
      user.avatar = {
        url: "",
        publicId: "",
      };

      await user.save();

      res.status(200).json({
        success: true,
        message: "Xóa avatar thành công",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Delete avatar error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi xóa avatar",
      });
    }
  }

  // API Verify Reset Token (để check token hợp lệ từ frontend)
  static async verifyResetToken(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token không được để trống",
        });
      }

      // Hash token để so sánh
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Tìm user với token và kiểm tra expiry
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      res.status(200).json({
        success: true,
        message: "Token hợp lệ",
        data: {
          email: user.email,
          expiresAt: user.resetPasswordExpire,
        },
      });
    } catch (error) {
      console.error("Verify reset token error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi verify token",
      });
    }
  }
}

module.exports = AdvancedController;
