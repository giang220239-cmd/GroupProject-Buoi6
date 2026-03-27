# 📋 Sản phẩm nộp - Buổi 6: Refresh Token & Session Management

## 🚀 **Link GitHub Pull Request**
**Branch:** `feature/refresh-token`  
**Repository:** https://github.com/giang220239-cmd/group6-project4  
**Pull Request:** https://github.com/giang220239-cmd/group6-project4/pull/new/feature/refresh-token

---

## 📸 **1. Ảnh Postman test /auth/refresh**

### Hướng dẫn test Postman:
Tham khảo file: [`POSTMAN_REFRESH_TOKEN_TEST.md`](./POSTMAN_REFRESH_TOKEN_TEST.md)

**Test cases cần chụp ảnh:**
1. ✅ **Refresh Token thành công** - Status 200
2. ❌ **Refresh Token không hợp lệ** - Status 403  
3. ❌ **Thiếu Refresh Token** - Status 400

**Endpoint:** `POST http://localhost:8080/api/auth/refresh`

---

## 🎥 **2. Demo frontend tự refresh token**

### Hướng dẫn demo:
Tham khảo file: [`FRONTEND_REFRESH_TOKEN_DEMO.md`](./FRONTEND_REFRESH_TOKEN_DEMO.md)

**Các bước demo:**
1. Đăng nhập và kiểm tra localStorage (accessToken + refreshToken)
2. Truy cập Protected Route (/profile, /admin)
3. Demo tự động refresh token khi API trả về 401
4. Kiểm tra Network tab trong DevTools

---

## 🔧 **3. Tính năng đã implement**

### **SV1 - Backend Advanced:**
- ✅ API `/auth/refresh` để cấp lại Access Token
- ✅ Middleware `verifyAccessToken` xác thực Access Token
- ✅ Lưu Refresh Token vào MongoDB với schema `RefreshToken`
- ✅ Login API trả về cả `accessToken` và `refreshToken`

### **SV2 - Frontend Advanced:**
- ✅ Axios interceptor tự động refresh token khi nhận 401
- ✅ `ProtectedRoute` component bảo vệ routes yêu cầu auth
- ✅ Lưu tokens trong localStorage
- ✅ Tự động retry request sau khi refresh token thành công

### **SV3 - Database & Integration:**
- ✅ Schema `RefreshToken` trong MongoDB
- ✅ Test API với Jest (2 test cases pass)
- ✅ Tối ưu DB với TTL index (30 ngày tự động xóa)

---

## 🧪 **4. Kết quả test**

### Jest Test Results:
```
✓ Should refresh access token successfully (2031 ms)
✓ Should fail with invalid refresh token (640 ms)

Test Suites: 1 passed, 1 total
Tests: 2 passed, 2 total
```

### API Endpoints:
- `POST /api/auth/login` - Trả về accessToken + refreshToken
- `POST /api/auth/refresh` - Refresh Access Token
- Protected routes sử dụng middleware `auth`

---

## 📂 **5. Files được thêm/sửa**

### Backend:
- `controllers/authController.js` - API refresh token
- `middleware/auth.js` - Middleware xác thực
- `models/RefreshToken.js` - Schema refresh token
- `routes/authRoute.js` - Route /refresh
- `tests/refreshToken.test.js` - Test cases
- `.env` - Thêm REFRESH_TOKEN_SECRET

### Frontend:
- `src/App.js` - Axios interceptor
- `src/ProtectedRoute.jsx` - Protected route component
- `src/Login.jsx` - Lưu access + refresh token

### Docs:
- `POSTMAN_REFRESH_TOKEN_TEST.md` - Hướng dẫn test Postman
- `FRONTEND_REFRESH_TOKEN_DEMO.md` - Hướng dẫn demo frontend

---

## 🔐 **6. Security Features**

- ✅ Access Token có thời gian sống ngắn (7 ngày)
- ✅ Refresh Token có thời gian sống dài (30 ngày)
- ✅ Refresh Token được lưu trong DB, có thể revoke
- ✅ Auto-retry mechanism khi token hết hạn
- ✅ Protected Routes yêu cầu authentication
- ✅ Token validation middleware

---

## 🎯 **7. Next Steps**
1. Chụp ảnh Postman test theo hướng dẫn
2. Quay video demo frontend auto refresh
3. Tạo Pull Request trên GitHub
4. Deploy và test trên production environment