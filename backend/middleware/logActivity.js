const Log = require("../models/Log");

const logActivity = async (req, res, next) => {
  const { userId, action } = req.body; // Lấy thông tin từ request
  const timestamp = new Date();

  try {
    await Log.create({ userId, action, timestamp });
    next();
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ message: "Failed to log activity" });
  }
};

module.exports = logActivity;
