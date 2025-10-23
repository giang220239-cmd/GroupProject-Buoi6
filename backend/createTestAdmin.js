require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const createTestAdmin = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Xóa admin cũ (nếu có)
    await User.deleteOne({ email: "testadmin@example.com" });

    // Tạo tài khoản admin test (đặt mật khẩu thô, model sẽ hash trong pre-save)
    const admin = new User({
      name: "Test Admin",
      email: "testadmin@example.com",
      password: "testadmin123",
      role: "admin",
      isActive: true,
    });

    await admin.save();
    console.log("✅ Test Admin account created successfully!");
    console.log("📧 Email: testadmin@example.com");
    console.log("🔑 Password: testadmin123");

    // Đóng kết nối
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating test admin:", error);
  }
};

createTestAdmin();
