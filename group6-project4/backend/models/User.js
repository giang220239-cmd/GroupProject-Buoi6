const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Đổi sang bcrypt

// Định nghĩa User schema với authentication fields
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên không được để trống"],
      trim: true,
      minlength: [2, "Tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên không vượt quá 100 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Email không được để trống"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Không trả về password khi query
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // tự động thêm createdAt và updatedAt
);

// Middleware để hash password trước khi save
userSchema.pre("save", async function (next) {
  // Chỉ hash password nếu nó được modify
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash password với salt rounds = 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method để tạo reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Tạo token random
  const resetToken = require("crypto").randomBytes(20).toString("hex");

  // Hash và set vào database
  this.resetPasswordToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (10 phút)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Xuất model, tránh lỗi khi server reload nhiều lần
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
