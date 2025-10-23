const mongoose = require("mongoose");
const Log = require("./models/Log");
require("dotenv").config();

const seedLogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const logs = [
      { message: "User logged in", level: "info" },
      { message: "User updated profile", level: "info" },
      { message: "Failed login attempt", level: "warn" },
      { message: "Server error occurred", level: "error" },
    ];

    await Log.insertMany(logs);
    console.log("✅ Logs seeded successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding logs:", error);
  }
};

seedLogs();
