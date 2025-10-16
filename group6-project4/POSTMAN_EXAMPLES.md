# 🧪 POSTMAN TESTING - VÍ DỤ CỤ THỂ

## 🔧 **Setup Postman Environment**

### **Environment Name:** `Advanced Features Test`

### **Variables:**

```
baseUrl = http://localhost:8080/api
userEmail = testuser@gmail.com
userName = Nguyen Van Test
userPassword = 123456789
newPassword = newpass123
jwtToken = (để trống - sẽ tự động fill)
resetToken = (để trống - sẽ lấy từ database)
```

---

## 📋 **Test Cases với Data Cụ Thể**

### **🔥 BƯỚC 1: Tạo User Test**

**Request Name:** `01 - Create Test User`
**Method:** `POST`
**URL:** `{{baseUrl}}/auth/signup`
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "{{userName}}",
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "Nguyen Van Test",
    "email": "testuser@gmail.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-10-11T08:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Tests Script:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Save JWT Token", function () {
  const response = pm.response.json();
  if (response.token) {
    pm.environment.set("jwtToken", response.token);
    console.log("JWT Token saved:", response.token.substring(0, 20) + "...");
  }
});
```

---

### **🔐 BƯỚC 2: Test Forgot Password**

**Request Name:** `02 - Forgot Password`
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

**Expected Response:**

```json
{
  "success": true,
  "message": "Email hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư của bạn",
  "data": {
    "email": "testuser@gmail.com",
    "resetTokenExpire": "2025-10-11T08:40:00.000Z"
  }
}
```

**Tests Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
  const response = pm.response.json();
  pm.expect(response.success).to.be.true;
});

pm.test("Email matches", function () {
  const response = pm.response.json();
  pm.expect(response.data.email).to.eql(pm.environment.get("userEmail"));
});
```

---

### **📋 BƯỚC 3: Lấy Reset Token (Manual)**

**⚠️ Bước thủ công - Copy token từ MongoDB**

#### **MongoDB Query Example:**

```javascript
// Trong MongoDB Compass hoặc Shell
db.users.findOne(
  { email: "testuser@gmail.com" },
  {
    resetPasswordToken: 1,
    resetPasswordExpire: 1,
    email: 1,
  }
);
```

**Sample Result:**

```json
{
  "_id": "671234567890abcdef123456",
  "email": "testuser@gmail.com",
  "resetPasswordToken": "a1b2c3d4e5f6789012345678901234567890abcd",
  "resetPasswordExpire": "2025-10-11T08:40:00.000Z"
}
```

**👉 Copy giá trị `resetPasswordToken` và paste vào Postman Environment variable `resetToken`**

---

### **🔄 BƯỚC 4: Test Reset Password**

**Request Name:** `03 - Reset Password`
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

**Expected Response:**

```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới",
  "data": {
    "email": "testuser@gmail.com",
    "name": "Nguyen Van Test"
  }
}
```

**Tests Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Password reset successful", function () {
  const response = pm.response.json();
  pm.expect(response.success).to.be.true;
  pm.expect(response.message).to.include("thành công");
});
```

---

### **🔑 BƯỚC 5: Login với Password Mới**

**Request Name:** `04 - Login with New Password`
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

**Expected Response:**

```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "Nguyen Van Test",
    "email": "testuser@gmail.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Tests Script:**

```javascript
pm.test("Login successful with new password", function () {
  pm.response.to.have.status(200);

  const response = pm.response.json();
  pm.environment.set("jwtToken", response.token);
  console.log("New JWT Token saved after password reset");
});
```

---

### **🖼️ BƯỚC 6: Test Upload Avatar**

**Request Name:** `05 - Upload Avatar`
**Method:** `POST`
**URL:** `{{baseUrl}}/advanced/upload-avatar`
**Headers:**

```
Authorization: Bearer {{jwtToken}}
```

**Body:** `form-data`

- Key: `avatar`
- Type: `File`
- Value: Chọn file ảnh (ví dụ: `avatar-test.jpg`)

**Expected Response (Success - nếu Cloudinary được config):**

```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Nguyen Van Test",
      "email": "testuser@gmail.com",
      "avatar": {
        "url": "https://res.cloudinary.com/demo/image/upload/v1697023456/user-avatars/xyz123.jpg",
        "publicId": "user-avatars/xyz123"
      },
      "role": "user"
    }
  }
}
```

**Expected Response (Cloudinary Error - hiện tại):**

```json
{
  "success": false,
  "message": "Lỗi server khi upload avatar"
}
```

**Tests Script:**

```javascript
pm.test("Avatar upload attempted", function () {
  // Có thể 200 (success) hoặc 500 (cloudinary error)
  pm.expect([200, 500]).to.include(pm.response.code);
});

if (pm.response.code === 200) {
  pm.test("Avatar uploaded successfully", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.user.avatar.url).to.be.a("string");
  });
}
```

---

### **🗑️ BƯỚC 7: Test Delete Avatar**

**Request Name:** `06 - Delete Avatar`
**Method:** `DELETE`
**URL:** `{{baseUrl}}/advanced/delete-avatar`
**Headers:**

```
Authorization: Bearer {{jwtToken}}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Xóa avatar thành công",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Nguyen Van Test",
      "email": "testuser@gmail.com",
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

## ❌ **Error Test Cases với Data Cụ Thể**

### **E1: Forgot Password - Email không tồn tại**

**Body:**

```json
{
  "email": "khongtontai@fake.com"
}
```

**Expected:** `404` + "Không tìm thấy tài khoản với email này"

### **E2: Reset Password - Token giả**

**Body:**

```json
{
  "token": "token-gia-12345",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

**Expected:** `400` + "Token không hợp lệ hoặc đã hết hạn"

### **E3: Upload Avatar - Thiếu Authorization**

**Headers:** Bỏ `Authorization: Bearer {{jwtToken}}`
**Expected:** `401` + "Access denied. No token provided."

---

## 🎯 **Checklist để Test:**

### **Chuẩn bị:**

- [ ] Backend server đang chạy (port 8080)
- [ ] MongoDB connected
- [ ] Postman environment setup
- [ ] File ảnh test (jpg/png, <5MB)

### **Test Flow:**

- [ ] 1. Create user → Status 201
- [ ] 2. Forgot password → Status 200
- [ ] 3. Get reset token from DB → Manual step
- [ ] 4. Reset password → Status 200
- [ ] 5. Login with new password → Status 200
- [ ] 6. Upload avatar → Status 200/500
- [ ] 7. Delete avatar → Status 200

### **Error Tests:**

- [ ] Invalid email → 404
- [ ] Invalid token → 400
- [ ] No authorization → 401
- [ ] Wrong file type → 400

**Tất cả test cases với data cụ thể sẵn sàng! 🧪✨**
