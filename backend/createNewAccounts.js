const mongoose = require("mongoose");
const User = require("./models/User");

const createAdminAccount = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Tạo tài khoản admin
    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123", // Nên hash mật khẩu trong thực tế
      role: "admin",
    });

    await admin.save();
    console.log("Admin account created successfully!");

    // Đóng kết nối
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};

createAdminAccount();
