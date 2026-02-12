require("dotenv").config({ path: "../.env" });

console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Setup và teardown
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Refresh Token API Tests", () => {
  let user;
  let refreshToken;

  beforeEach(async () => {
    // Tạo user mẫu
    user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    // Tạo refresh token hợp lệ
    const token = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );

    refreshToken = await RefreshToken.create({
      token,
      userId: user._id,
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await RefreshToken.deleteMany();
  });

  test("Should refresh access token successfully", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: refreshToken.token });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("Should fail with invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "invalid_token" });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid Refresh Token");
  });
});
