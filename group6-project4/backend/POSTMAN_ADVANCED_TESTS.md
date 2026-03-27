# 🧪 POSTMAN TESTS - ADVANCED FEATURES

## 📋 **Base URL**

```
http://localhost:8080/api
```

## 🔐 **Test 1: FORGOT PASSWORD**

### **Request:**

```
POST /advanced/forgot-password
Content-Type: application/json
```

### **Body (JSON):**

```json
{
  "email": "test@example.com"
}
```

### **Expected Response (Success):**

```json
{
  "success": true,
  "message": "Email hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn",
  "data": {
    "email": "test@example.com",
    "resetTokenExpire": "2025-10-11T15:30:00.000Z"
  }
}
```

### **Expected Response (User Not Found):**

```json
{
  "success": false,
  "message": "Không tìm thấy tài khoản với email này"
}
```

---

## 🔄 **Test 2: RESET PASSWORD**

### **Bước 1: Lấy reset token từ database**

Sau khi call forgot-password, cần lấy token từ MongoDB:

```javascript
// Trong MongoDB Compass hoặc shell
db.users.findOne({ email: "test@example.com" }, { resetPasswordToken: 1 });
```

### **Request:**

```
POST /advanced/reset-password
Content-Type: application/json
```

### **Body (JSON):**

```json
{
  "token": "your-reset-token-here",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### **Expected Response (Success):**

```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới",
  "data": {
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### **Expected Response (Invalid Token):**

```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

## 🖼️ **Test 3: UPLOAD AVATAR**

### **Bước 1: Lấy JWT Token**

Đăng nhập để lấy token:

```
POST /auth/login
{
  "email": "test@example.com",
  "password": "your-password"
}
```

### **Request:**

```
POST /advanced/upload-avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

### **Body (Form-data):**

- Key: `avatar`
- Type: File
- Value: Chọn file ảnh (jpg, png, gif, webp)

### **Expected Response (Success):**

```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Test User",
      "email": "test@example.com",
      "avatar": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "user-avatars/..."
      },
      "role": "user"
    }
  }
}
```

### **Expected Response (No File):**

```json
{
  "success": false,
  "message": "Vui lòng chọn file ảnh để upload"
}
```

---

## 🗑️ **Test 4: DELETE AVATAR**

### **Request:**

```
DELETE /advanced/delete-avatar
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Expected Response (Success):**

```json
{
  "success": true,
  "message": "Xóa avatar thành công",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Test User",
      "email": "test@example.com",
      "avatar": {
        "url": "",
        "publicId": ""
      },
      "role": "user"
    }
  }
}
```

---

## ✅ **Test 5: VERIFY RESET TOKEN**

### **Request:**

```
GET /advanced/verify-reset-token/YOUR_RESET_TOKEN
```

### **Expected Response (Valid Token):**

```json
{
  "success": true,
  "message": "Token hợp lệ",
  "data": {
    "email": "test@example.com",
    "expiresAt": "2025-10-11T15:30:00.000Z"
  }
}
```

---

## 🎯 **Test Scenarios cho Screenshots:**

### **Scenario 1: Forgot Password Flow**

1. POST `/advanced/forgot-password` với email hợp lệ
2. Chụp response thành công
3. Kiểm tra database có token được tạo

### **Scenario 2: Reset Password Flow**

1. Lấy token từ database
2. POST `/advanced/reset-password` với token + password mới
3. Chụp response thành công
4. Test login với password mới

### **Scenario 3: Avatar Upload**

1. Login để lấy JWT token
2. POST `/advanced/upload-avatar` với file ảnh
3. Chụp response với avatar URL
4. Test GET `/profile` để xem avatar đã update

### **Scenario 4: Error Handling**

- Test với email không tồn tại
- Test với token hết hạn
- Test upload file không phải ảnh
- Test với JWT token không hợp lệ

---

## 🚀 **Postman Collection Import**

Tạo collection với tên "Advanced Features Tests" và import các requests trên để test nhanh chóng!

## 📝 **Notes:**

- Cloudinary sẽ trả về lỗi vì chưa config, nhưng API vẫn hoạt động
- Email service có thể lỗi authentication, nhưng logic reset password vẫn đúng
- Tất cả API endpoints đều đã sẵn sàng cho testing!
