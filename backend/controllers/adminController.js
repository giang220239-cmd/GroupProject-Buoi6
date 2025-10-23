const User = require("../models/User");
const Log = require("../models/Log");

// @desc    Tạo admin user đầu tiên (chỉ để setup)
// @route   POST /api/setup/admin
// @access  Public (chỉ để setup ban đầu)
const createAdmin = async (req, res) => {
  try {
    // Kiểm tra xem đã có admin nào chưa
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists. This endpoint is disabled.",
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Tạo admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully!",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating admin user.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Lấy danh sách tất cả users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "" } = req.query;

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
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// @desc    Xóa user (Admin hoặc Owner)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin or Owner)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép xóa chính mình nếu là admin cuối cùng
    if (req.user.role === "admin" && req.user._id.toString() === id) {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last admin user.",
        });
      }
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: `User "${deletedUser.name}" deleted successfully.`,
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role,
      },
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting user.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// @desc    Cập nhật role của user (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'.",
      });
    }

    // Không cho phép hạ quyền admin cuối cùng
    if (
      req.user._id.toString() === id &&
      req.user.role === "admin" &&
      role !== "admin"
    ) {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot demote the last admin user.",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating user role.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// @desc    Lấy danh sách logs
// @route   GET /admin/logs
// @access  Private (Admin)
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
    });
  }
};

module.exports = {
  createAdmin,
  getAllUsers,
  deleteUserById,
  updateUserRole,
  getLogs,
};
