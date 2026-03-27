# 🚀 POSTMAN COLLECTION - Advanced Features APIs

## 🔧 **Setup Environment trong Postman**

### **Environment Variables:**

```json
{
  "baseUrl": "http://localhost:8080/api",
  "userEmail": "test@example.com",
  "userPassword": "password123",
  "newPassword": "newpassword123",
  "jwtToken": "",
  "resetToken": ""
}
```

---

## 📝 **Collection Tests - Thực hiện theo thứ tự**

### **Test 1: 🆕 Tạo User mới**

**Method:** `POST`
**URL:** `{{baseUrl}}/auth/signup`
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Test User Advanced",
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}
```

**Expected Status:** `201 Created`
**Expected Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": "...",
    "name": "Test User Advanced",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Post-request Script:**

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("jwtToken", response.token);
  console.log("JWT Token saved:", response.token);
}
```

---

### **Test 2: 🔐 Forgot Password**

**Method:** `POST`
**URL:** `{{baseUrl}}/advanced/forgot-password`
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "{{userEmail}}"
}
```

**Expected Status:** `200 OK`
**Expected Response:**

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

**Note:** Email sẽ fail vì chưa config SMTP, nhưng token đã được lưu vào database.

---

### **Test 3: 📋 Lấy Reset Token (Manual Step)**

**⚠️ Bước thủ công - Không thể tự động hóa trong Postman**

Vì email service chưa hoạt động, cần lấy reset token từ database:

#### **Option A: MongoDB Compass**

1. Mở MongoDB Compass
2. Connect: `mongodb+srv://...` (từ .env)
3. Database → Collection `users`
4. Filter: `{"email": "test@example.com"}`
5. Copy giá trị `resetPasswordToken`

#### **Option B: MongoDB Shell**

```javascript
use your_database_name
db.users.findOne(
  {email: "test@example.com"},
  {resetPasswordToken: 1, resetPasswordExpire: 1}
)
```

**Paste token vào Environment Variable `resetToken`**

---

### **Test 4: 🔄 Reset Password**

**Method:** `POST`
**URL:** `{{baseUrl}}/advanced/reset-password`
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "token": "{{resetToken}}",
  "newPassword": "{{newPassword}}",
  "confirmPassword": "{{newPassword}}"
}
```

**Expected Status:** `200 OK`
**Expected Response:**

```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới",
  "data": {
    "email": "test@example.com",
    "name": "Test User Advanced"
  }
}
```

---

### **Test 5: 🔑 Login với Password mới**

**Method:** `POST`
**URL:** `{{baseUrl}}/auth/login`
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "{{userEmail}}",
  "password": "{{newPassword}}"
}
```

**Expected Status:** `200 OK`
**Post-request Script:**

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("jwtToken", response.token);
  console.log("New JWT Token saved:", response.token);
}
```

---

### **Test 6: 🖼️ Upload Avatar**

**Method:** `POST`
**URL:** `{{baseUrl}}/advanced/upload-avatar`
**Headers:**

```
Authorization: Bearer {{jwtToken}}
```

**Body:** `form-data`

- Key: `avatar`
- Type: `File`
- Value: Chọn file ảnh (jpg, png, gif)

**Expected Status:** `200 OK` (hoặc có thể `500` do Cloudinary chưa config)

**Success Response:**

```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User Advanced",
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

**Cloudinary Error Response (Expected):**

```json
{
  "success": false,
  "message": "Lỗi server khi upload avatar"
}
```

---

### **Test 7: 🗑️ Delete Avatar**

**Method:** `DELETE`
**URL:** `{{baseUrl}}/advanced/delete-avatar`
**Headers:**

```
Authorization: Bearer {{jwtToken}}
```

**Expected Status:** `200 OK`
**Expected Response:**

```json
{
  "success": true,
  "message": "Xóa avatar thành công",
  "data": {
    "user": {
      "id": "...",
      "avatar": {
        "url": "",
        "publicId": ""
      }
    }
  }
}
```

---

## 🚫 **Error Test Cases**

### **Test E1: Forgot Password - Email không tồn tại**

**Body:**

```json
{
  "email": "notfound@example.com"
}
```

**Expected:** `404` - "Không tìm thấy tài khoản với email này"

### **Test E2: Reset Password - Token không hợp lệ**

**Body:**

```json
{
  "token": "invalid-token",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

**Expected:** `400` - "Token không hợp lệ hoặc đã hết hạn"

### **Test E3: Upload Avatar - Không có JWT Token**

**Headers:** Bỏ Authorization header
**Expected:** `401` - "Access denied. No token provided."

### **Test E4: Upload Avatar - File không phải ảnh**

**Body:** Upload file .txt
**Expected:** `400` - "Chỉ cho phép upload file ảnh"

---

## 📊 **Test Results Summary**

### **✅ Expected Working APIs:**

- ✅ POST `/advanced/forgot-password` → 200 (token saved to DB)
- ✅ POST `/advanced/reset-password` → 200 (password updated)
- ✅ GET `/advanced/verify-reset-token/:token` → 200
- ✅ DELETE `/advanced/delete-avatar` → 200

### **⚠️ Partially Working:**

- ⚠️ POST `/advanced/upload-avatar` → 500 (Cloudinary error, but logic OK)

### **📝 Notes:**

- Email service sẽ fail nhưng reset token vẫn được tạo
- Cloudinary sẽ fail nhưng file upload logic vẫn đúng
- Tất cả authentication và validation đều hoạt động

---

## 🎯 **Import vào Postman:**

1. Tạo **New Collection** tên "Advanced Features"
2. Tạo **Environment** với variables ở trên
3. Thêm từng request theo thứ tự
4. Chạy collection để test full flow
5. Screenshot các response để báo cáo

**Collection sẵn sàng cho testing! 🧪✨**
