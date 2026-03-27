# 🧪 API Testing Script - Advanced Features

## 📝 **Bước 1: Tạo Test User**

### **Đăng ký User mới:**

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **Đăng nhập để lấy Token:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Lưu JWT Token từ response để sử dụng ở các API khác!**

---

## 🔐 **Bước 2: Test Forgot Password**

```bash
curl -X POST http://localhost:8080/api/advanced/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
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

## 🔄 **Bước 3: Lấy Reset Token từ Database**

Vì email service chưa config, cần lấy token trực tiếp từ MongoDB:

### **Option 1: MongoDB Compass**

1. Mở MongoDB Compass
2. Connect đến database
3. Tìm collection `users`
4. Tìm user với email `test@example.com`
5. Copy giá trị field `resetPasswordToken`

### **Option 2: MongoDB Shell**

```javascript
db.users.findOne(
  { email: "test@example.com" },
  { resetPasswordToken: 1, resetPasswordExpire: 1 }
);
```

---

## 🔄 **Bước 4: Test Reset Password**

```bash
curl -X POST http://localhost:8080/api/advanced/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN_HERE",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

---

## 🖼️ **Bước 5: Test Upload Avatar**

### **Đăng nhập lại với password mới:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "newpassword123"
  }'
```

### **Upload Avatar (cần file ảnh):**

```bash
curl -X POST http://localhost:8080/api/advanced/upload-avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@path/to/your/image.jpg"
```

**Note:** Thay `YOUR_JWT_TOKEN` bằng token từ login response
**Note:** Thay `path/to/your/image.jpg` bằng đường dẫn file ảnh thực tế

---

## 🗑️ **Bước 6: Test Delete Avatar**

```bash
curl -X DELETE http://localhost:8080/api/advanced/delete-avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ✅ **Bước 7: Test Verify Token**

```bash
curl -X GET http://localhost:8080/api/advanced/verify-reset-token/YOUR_RESET_TOKEN \
  -H "Content-Type: application/json"
```

---

## 🚀 **Quick Test với Postman/Thunder Client**

### **Collection Setup:**

1. **Base URL:** `http://localhost:8080/api`
2. **Environment Variables:**
   - `baseUrl`: `http://localhost:8080/api`
   - `token`: (sẽ update sau khi login)
   - `resetToken`: (sẽ lấy từ database)

### **Request Order:**

1. ✅ **POST** `/auth/signup` - Tạo user
2. ✅ **POST** `/auth/login` - Lấy JWT token
3. ✅ **POST** `/advanced/forgot-password` - Tạo reset token
4. 📋 **Manual** - Lấy reset token từ database
5. ✅ **POST** `/advanced/reset-password` - Reset password
6. ✅ **POST** `/auth/login` - Login với password mới
7. ✅ **POST** `/advanced/upload-avatar` - Upload ảnh (form-data)
8. ✅ **DELETE** `/advanced/delete-avatar` - Xóa avatar

---

## 🎯 **Expected Results:**

### **Success Responses:**

- Signup: `201` với user info
- Login: `200` với JWT token
- Forgot Password: `200` với success message
- Reset Password: `200` với success message
- Upload Avatar: `200` với avatar URL (sẽ lỗi Cloudinary nhưng logic OK)
- Delete Avatar: `200` với success message

### **Error Cases to Test:**

- Email không tồn tại → `404`
- Token không hợp lệ → `400`
- JWT token thiếu → `401`
- File không phải ảnh → `400`
- Password không khớp → `400`

**All APIs ready for testing! 🧪✨**
