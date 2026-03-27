const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Định nghĩa User schema với validation
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
    },
    role: {
      type: String,
      default: "user", // Mặc định là "user"
      enum: ["user", "admin"], // Chỉ chấp nhận "user" hoặc "admin"
    },
  },
  { timestamps: true } // tự động thêm createdAt và updatedAt
);

// Hash mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Phương thức kiểm tra mật khẩu
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Xuất model, tránh lỗi khi server reload nhiều lần
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
