# 🚀 CURL COMMANDS - Copy & Paste

## **Setup môi trường test:**

```bash
# Biến môi trường (chạy trước tiên)
$BASE_URL = "http://localhost:8080/api"
$USER_EMAIL = "testuser@gmail.com"
$USER_NAME = "Nguyen Van Test"
$USER_PASSWORD = "123456789"
$NEW_PASSWORD = "newpass123"
```

---

## **📋 1. Tạo User Test**

```bash
curl -X POST $BASE_URL/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Nguyen Van Test",
    "email": "testuser@gmail.com",
    "password": "123456789"
  }'
```

**Copy JWT Token từ response để dùng cho các bước sau!**

---

## **🔐 2. Test Forgot Password**

```bash
curl -X POST $BASE_URL/advanced/forgot-password `
  -H "Content-Type: application/json" `
  -d '{
    "email": "testuser@gmail.com"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Email hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn"
}
```

---

## **📋 3. Lấy Reset Token từ Database**

### **MongoDB Query (thực hiện trong MongoDB Compass):**

```javascript
db.users.findOne(
  { email: "testuser@gmail.com" },
  { resetPasswordToken: 1, email: 1 }
);
```

**Sample Output:**

```json
{
  "_id": "671234567890abcdef123456",
  "email": "testuser@gmail.com",
  "resetPasswordToken": "a1b2c3d4e5f6789012345678901234567890abcd"
}
```

**👉 Copy giá trị `resetPasswordToken` để dùng cho bước tiếp theo!**

---

## **🔄 4. Test Reset Password**

```bash
# Thay YOUR_RESET_TOKEN bằng token từ database
curl -X POST $BASE_URL/advanced/reset-password `
  -H "Content-Type: application/json" `
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới"
}
```

---

## **🔑 5. Login với Password Mới**

```bash
curl -X POST $BASE_URL/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "testuser@gmail.com",
    "password": "newpass123"
  }'
```

**Copy JWT Token mới từ response!**

---

## **🖼️ 6. Test Upload Avatar**

```bash
# Thay YOUR_JWT_TOKEN bằng token từ login
# Thay path/to/avatar.jpg bằng đường dẫn file ảnh thật
curl -X POST $BASE_URL/advanced/upload-avatar `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -F "avatar=@path/to/avatar.jpg"
```

**Expected Response (nếu Cloudinary configured):**

```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "avatar": {
        "url": "https://res.cloudinary.com/demo/image/upload/...",
        "publicId": "user-avatars/xyz123"
      }
    }
  }
}
```

**Expected Response (Cloudinary chưa config - hiện tại):**

```json
{
  "success": false,
  "message": "Lỗi server khi upload avatar"
}
```

---

## **🗑️ 7. Test Delete Avatar**

```bash
# Thay YOUR_JWT_TOKEN bằng token hiện tại
curl -X DELETE $BASE_URL/advanced/delete-avatar `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## **❌ Error Test Cases**

### **Invalid Email:**

```bash
curl -X POST $BASE_URL/advanced/forgot-password `
  -H "Content-Type: application/json" `
  -d '{
    "email": "khongtontai@fake.com"
  }'
```

**Expected:** Status 404

### **Invalid Reset Token:**

```bash
curl -X POST $BASE_URL/advanced/reset-password `
  -H "Content-Type: application/json" `
  -d '{
    "token": "fake-token-12345",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }'
```

**Expected:** Status 400

### **No Authorization Header:**

```bash
curl -X POST $BASE_URL/advanced/upload-avatar `
  -F "avatar=@path/to/avatar.jpg"
```

**Expected:** Status 401

---

## **🎯 Quick Test Flow:**

```bash
# 1. Tạo user
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@test.com", "password": "123456789"}'

# 2. Forgot password
curl -X POST http://localhost:8080/api/advanced/forgot-password -H "Content-Type: application/json" -d '{"email": "test@test.com"}'

# 3. [Manual] Lấy resetToken từ MongoDB

# 4. Reset password
curl -X POST http://localhost:8080/api/advanced/reset-password -H "Content-Type: application/json" -d '{"token": "RESET_TOKEN", "newPassword": "newpass123", "confirmPassword": "newpass123"}'

# 5. Login với password mới
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email": "test@test.com", "password": "newpass123"}'

# 6. Upload avatar
curl -X POST http://localhost:8080/api/advanced/upload-avatar -H "Authorization: Bearer JWT_TOKEN" -F "avatar=@avatar.jpg"
```

**Tất cả commands sẵn sàng copy & paste! 🚀**
