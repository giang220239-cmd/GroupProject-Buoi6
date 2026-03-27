# 🧪 HƯỚNG DẪN TEST API AUTHENTICATION - POSTMAN

## 📋 Base URL
```
http://localhost:8080/api
```

## 🔐 1. ĐĂNG KÝ TẠI KHOẢN (Sign Up)

### Request
```
Method: POST
URL: http://localhost:8080/api/auth/signup
Headers: 
  Content-Type: application/json
```

### Body (JSON):
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "role": "user"
}
```

### Expected Response (201):
```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6752abc...",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T03:30:00.000Z",
    "createdAt": "2025-10-11T03:30:00.000Z"
  }
}
```

---

## 🔑 2. ĐĂNG NHẬP (Login)

### Request
```
Method: POST
URL: http://localhost:8080/api/auth/login
Headers: 
  Content-Type: application/json
```

### Body (JSON):
```json
{
  "email": "nguyenvana@example.com",
  "password": "Password123"
}
```

### Expected Response (200):
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6752abc...",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T03:35:00.000Z",
    "createdAt": "2025-10-11T03:30:00.000Z"
  }
}
```

---

## 🚪 3. ĐĂNG XUẤT (Logout)

### Request
```
Method: POST
URL: http://localhost:8080/api/auth/logout
Headers: 
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Body: (Không cần)

### Expected Response (200):
```json
{
  "success": true,
  "message": "Đăng xuất thành công!"
}
```

---

## 👤 4. LẤY THÔNG TIN USER HIỆN TẠI (Get Me)

### Request
```
Method: GET
URL: http://localhost:8080/api/auth/me
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Expected Response (200):
```json
{
  "success": true,
  "user": {
    "id": "6752abc...",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T03:35:00.000Z",
    "createdAt": "2025-10-11T03:30:00.000Z",
    "updatedAt": "2025-10-11T03:35:00.000Z"
  }
}
```

---

## ✅ 5. VERIFY TOKEN

### Request
```
Method: GET
URL: http://localhost:8080/api/auth/verify
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Expected Response (200):
```json
{
  "success": true,
  "message": "Token hợp lệ",
  "user": {
    "id": "6752abc...",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "role": "user"
  }
}
```

---

## 🛡️ 6. TEST TẠO ADMIN USER

### Request (Tạo Admin):
```
Method: POST
URL: http://localhost:8080/api/auth/signup
Headers: 
  Content-Type: application/json
```

### Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "confirmPassword": "AdminPass123",
  "role": "admin"
}
```

---

## 👥 7. DANH SÁCH USERS (Chỉ Admin)

### Request
```
Method: GET
URL: http://localhost:8080/api/users
Headers: 
  Authorization: Bearer [ADMIN_TOKEN]
```

### Query Parameters (Optional):
```
?page=1&limit=10&search=nguyen&role=user
```

### Expected Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "6752abc...",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "lastLogin": "2025-10-11T03:35:00.000Z",
      "createdAt": "2025-10-11T03:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "limit": 10
  }
}
```

---

## ❌ ERROR TEST CASES

### 1. Đăng ký với email đã tồn tại:
**Response (400):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng. Vui lòng chọn email khác."
}
```

### 2. Đăng nhập với sai password:
**Response (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng."
}
```

### 3. Truy cập protected route không có token:
**Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 4. User thường truy cập admin route:
**Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

---

## 📝 NOTES FOR TESTING

1. **Lưu Token**: Sau khi đăng ký/đăng nhập thành công, copy token để sử dụng cho các request khác
2. **Headers**: Đảm bảo thêm `Authorization: Bearer [TOKEN]` cho các protected routes
3. **Content-Type**: Luôn thêm `Content-Type: application/json` khi gửi JSON data
4. **Password Requirements**: Mật khẩu phải có ít nhất 6 ký tự, chứa chữ hoa, chữ thường và số
5. **Role System**: `user` (người dùng thường) và `admin` (quản trị viên)

## 🔄 TEST FLOW RECOMMENDATION

1. Đăng ký tài khoản user thường
2. Đăng ký tài khoản admin
3. Đăng nhập bằng user thường → lưu user token
4. Đăng nhập bằng admin → lưu admin token
5. Test get me với user token
6. Test get users với admin token
7. Test get users với user token (should fail)
8. Test verify token
9. Test logout