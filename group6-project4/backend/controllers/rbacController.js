const User = require("../models/User");
const { checkRole } = require("../middleware/auth");

// @desc    Lấy danh sách tất cả users (Admin only)
// @route   GET /api/rbac/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Thay đổi role của user (Admin only)
// @route   PUT /api/rbac/users/:id/role
// @access  Private (Admin)
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "moderator"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be: user, admin, or moderator",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User role changed to ${role}`,
      data: user,
    });
  } catch (error) {
    console.error("Change user role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Kích hoạt/vô hiệu hóa user (Admin & Moderator)
// @route   PUT /api/rbac/users/:id/status
// @access  Private (Admin, Moderator)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"}`,
      data: user,
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Xóa user (Admin only)
// @route   DELETE /api/rbac/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép admin xóa chính mình
    if (req.user.userId === id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Lấy thống kê users theo role (Admin & Moderator)
// @route   GET /api/rbac/stats
// @access  Private (Admin, Moderator)
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        byRole: stats,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
};
