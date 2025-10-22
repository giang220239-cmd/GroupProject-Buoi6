const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors"); // thêm cors để frontend gọi không bị chặn
const rateLimit = require("express-rate-limit");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const adminRoutes = require("./routes/adminRoute");
const advancedRoutes = require("./routes/advancedRoute");
const rbacRoutes = require("./routes/rbacRoute");

// Import services để test connection
const emailService = require("./services/emailService");
const CloudinaryService = require("./services/cloudinaryService");
const { createSampleUsers } = require("./utils/seedRBAC");

// Rate limiter for login
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử
  message: "Too many login attempts, please try again later",
});

// Use routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/advanced", advancedRoutes);
app.use("/rbac", rbacRoutes);

// Test route để debug
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working", timestamp: new Date() });
});

// Debug RBAC route
app.get("/api/debug/rbac", (req, res) => {
  const authHeader = req.header("Authorization");
  res.json({
    message: "Debug RBAC endpoint",
    hasAuth: !!authHeader,
    authHeader: authHeader,
    timestamp: new Date(),
  });
});

// Debug login route - để test frontend connection
app.post("/api/debug/login", async (req, res) => {
  console.log("🔍 Debug login request:", req.body);
  res.json({
    success: true,
    message: "Debug login endpoint working",
    receivedData: req.body,
    timestamp: new Date(),
  });
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Tạo dữ liệu mẫu RBAC
    createSampleUsers();

    // Test connections (commented out to prevent crash during testing)
    // emailService.testConnection().catch(err =>
    //   console.log("❌ Email server connection failed:", err.message)
    // );

    // CloudinaryService.testConnection().catch(err =>
    //   console.log("❌ Cloudinary connection failed:", err.message)
    // );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server chạy cổng 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
