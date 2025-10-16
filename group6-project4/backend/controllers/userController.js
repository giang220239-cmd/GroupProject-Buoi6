// controllers/userController.js
const User = require("../models/User");
const { validationResult } = require("express-validator");

// GET /api/users - Chỉ Admin mới có thể xem danh sách tất cả users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    // Build query
    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    // Trả về mảng users trực tiếp để frontend dễ xử lý
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách users",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Tên và email là bắt buộc",
      });
    }

    // Tạo user mới trong MongoDB
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    // Xử lý lỗi trùng email
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email đã tồn tại trong hệ thống" });
    }
    res.status(500).json({ error: "Lỗi khi tạo user", detail: err.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi cập nhật user",
      detail: err.message,
    });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({
      error: "Lỗi khi xóa user",
      detail: err.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
