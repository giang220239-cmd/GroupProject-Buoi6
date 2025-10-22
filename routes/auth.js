const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware để xác thực JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err); // In lỗi ra console
      return res.status(403).json({ message: "Token không hợp lệ." });
    }
    req.user = user;
    next();
  });
};

// POST /signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Tạo user mới
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Error signing up:", error); // In lỗi ra console
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    console.error("Error logging in:", error); // In lỗi ra console
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

// POST /logout
router.post("/logout", (req, res) => {
  // Xóa token phía client (thường là xóa trong localStorage hoặc cookie)
  res.status(200).json({ message: "Đăng xuất thành công!" });
});

// API GET /profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    console.log("[DEBUG] GET /profile - User ID từ token:", req.user.id); // Debug user ID
    const userId = req.user.id; // Lấy userId từ JWT token
    const user = await User.findById(userId).select("-password"); // Không trả về mật khẩu

    if (!user) {
      console.log("[DEBUG] Không tìm thấy người dùng với ID:", userId); // Debug không tìm thấy user
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    console.log("[DEBUG] Thông tin người dùng:", user); // Debug thông tin user
    res.status(200).json(user);
  } catch (error) {
    console.error("[ERROR] Lỗi khi lấy thông tin profile:", error); // In lỗi ra console
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

// API PUT /profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    console.log("[DEBUG] PUT /profile - User ID từ token:", req.user.id); // Debug user ID
    const userId = req.user.id; // Lấy userId từ JWT token
    const { name, email } = req.body;

    console.log("[DEBUG] PUT /profile - Dữ liệu cập nhật:", { name, email }); // Debug dữ liệu cập nhật

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password"); // Không trả về mật khẩu

    if (!updatedUser) {
      console.log("[DEBUG] Không tìm thấy người dùng với ID:", userId); // Debug không tìm thấy user
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    console.log("[DEBUG] Thông tin người dùng sau khi cập nhật:", updatedUser); // Debug thông tin user
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("[ERROR] Lỗi khi cập nhật profile:", error); // In lỗi ra console
    res.status(500).json({ message: "Lỗi server.", error });
  }
});

module.exports = router;
