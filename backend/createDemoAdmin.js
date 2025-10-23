require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function createDemoAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@example.com";
    const plainPassword = "password123";

    // Remove existing
    await User.deleteOne({ email });

    const admin = new User({
      name: "Admin Demo",
      email,
      password: plainPassword,
      role: "admin",
      isActive: true,
    });

    await admin.save();
    console.log("✅ Demo admin created");
    console.log("Email:", email);
    console.log("Password:", plainPassword);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error creating demo admin:", err);
    process.exit(1);
  }
}

createDemoAdmin();
