# Test Refresh Token với Postman

## 1. Chuẩn bị
- Mở Postman
- Đảm bảo server đang chạy: `cd backend && npm start`
- MongoDB đã kết nối thành công

## 2. Test API /auth/refresh

### Bước 1: Đăng nhập để lấy Refresh Token
**POST** `http://localhost:8080/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response mong đợi:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Bước 2: Test Refresh Token API
**POST** `http://localhost:8080/api/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response lỗi - Invalid Token (403):**
```json
{
  "success": false,
  "message": "Invalid Refresh Token"
}
```

**Response lỗi - Missing Token (400):**
```json
{
  "success": false,
  "message": "Refresh Token is required"
}
```

## 3. Test Cases để chụp ảnh

### Test Case 1: Refresh Token thành công ✅
- Sử dụng Refresh Token hợp lệ
- Kết quả: Status 200, trả về Access Token mới

### Test Case 2: Refresh Token không hợp lệ ❌
- Sử dụng Refresh Token giả hoặc đã hết hạn
- Kết quả: Status 403, thông báo "Invalid Refresh Token"

### Test Case 3: Thiếu Refresh Token ❌
- Không gửi Refresh Token trong body
- Kết quả: Status 400, thông báo "Refresh Token is required"

## 4. Hướng dẫn chụp ảnh Postman
1. Chụp màn hình request với body JSON
2. Chụp màn hình response với status code và JSON response
3. Chụp cả 3 test cases trên để demo đầy đủ tính năng