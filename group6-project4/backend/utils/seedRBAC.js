const User = require("../models/User");
const bcrypt = require("bcrypt");

// Tạo dữ liệu mẫu cho các roles
const createSampleUsers = async () => {
  try {
    console.log("🔧 Tạo dữ liệu mẫu cho RBAC...");

    // Kiểm tra xem đã có users sample chưa
    const existingUsers = await User.find({
      email: {
        $in: ["admin@example.com", "moderator@example.com", "user@example.com"],
      },
    });

    if (existingUsers.length > 0) {
      console.log("ℹ️  Dữ liệu mẫu đã tồn tại, bỏ qua tạo mới");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Tạo sample users
    const sampleUsers = [
      {
        name: "System Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
      {
        name: "Content Moderator",
        email: "moderator@example.com",
        password: hashedPassword,
        role: "moderator",
        isActive: true,
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: hashedPassword,
        role: "user",
        isActive: true,
      },
      {
        name: "Test User 2",
        email: "user2@example.com",
        password: hashedPassword,
        role: "user",
        isActive: false, // Inactive user để test
      },
    ];

    await User.insertMany(sampleUsers);
    console.log("✅ Tạo dữ liệu mẫu RBAC thành công!");

    console.log("📋 Tài khoản test:");
    console.log("   Admin: admin@example.com / password123");
    console.log("   Moderator: moderator@example.com / password123");
    console.log("   User: user@example.com / password123");
  } catch (error) {
    console.error("❌ Lỗi tạo dữ liệu mẫu:", error);
  }
};

module.exports = { createSampleUsers };
