# 👥 TÀI KHOẢN TEST - READY TO USE

## **🔐 TÀI KHOẢN ĐÃ CÓ TRONG DATABASE:**

### **Account 1: User thường**

```
📧 Email: testuser@gmail.com
🔑 Password: 123456789
👤 Role: user
✅ Status: Active
```

### **Account 2: Admin**

```
📧 Email: admin@gmail.com
🔑 Password: 123456789
👤 Role: admin
✅ Status: Active
```

---

## **🚀 TẠO TÀI KHOẢN MỚI (VIA POSTMAN/CURL):**

### **Method 1: Tạo User Test mới**

**Postman Setup:**

- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "name": "Test Avatar User",
  "email": "avatartest@gmail.com",
  "password": "123456789"
}
```

### **Method 2: PowerShell Command**

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method POST -ContentType "application/json" -Body '{"name": "Frontend Test User", "email": "frontend@test.com", "password": "123456789"}'
```

---

## **🧪 TEST SCENARIOS:**

### **Scenario 1: Complete Flow Test**

```
1. Login: testuser@gmail.com / 123456789
2. Go to /forgot-password → Enter: testuser@gmail.com
3. Get reset token from MongoDB
4. Go to /reset-password → Enter token + new password
5. Login with new password
6. Go to /profile → Upload avatar
```

### **Scenario 2: New User Flow**

```
1. Go to /signup → Create new account
2. Login with new account
3. Go to /profile → Upload avatar
4. Test forgot password flow
```

### **Scenario 3: Error Testing**

```
1. Wrong email in forgot-password
2. Invalid token in reset-password
3. Upload avatar without login
4. Upload wrong file type
```

---

## **📋 QUICK LOGIN CREDENTIALS:**

### **For Frontend Testing:**

```javascript
// Có thể paste vào form login
Email: testuser@gmail.com
Password: 123456789

// Hoặc
Email: admin@gmail.com
Password: 123456789
```

### **For API Testing:**

```bash
# Login API Test
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@gmail.com", "password": "123456789"}'

# Hoặc PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "testuser@gmail.com", "password": "123456789"}'
```

---

## **🗄️ KIỂM TRA DATABASE:**

### **MongoDB Query để xem users:**

```javascript
// Trong MongoDB Compass hoặc Shell
db.users
  .find(
    {},
    {
      name: 1,
      email: 1,
      role: 1,
      isActive: 1,
      createdAt: 1,
      "avatar.url": 1,
    }
  )
  .pretty();
```

### **Lấy reset token sau forgot-password:**

```javascript
db.users.findOne(
  { email: "testuser@gmail.com" },
  {
    resetPasswordToken: 1,
    resetPasswordExpire: 1,
    email: 1,
  }
);
```

---

## **⚡ QUICK START COMMANDS:**

### **1. Start Backend:**

```powershell
cd D:\group6-project4\backend
node server.js
```

### **2. Start Frontend:**

```powershell
cd D:\group6-project4\frontend
npm start
```

### **3. Quick Login Test:**

```powershell
# Test login API
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email": "testuser@gmail.com", "password": "123456789"}'
```

---

## **🎯 TESTING CHECKLIST:**

### **Frontend UI Tests:**

- [ ] Login với testuser@gmail.com
- [ ] Navigate to /forgot-password
- [ ] Enter email và submit
- [ ] Navigate to /reset-password
- [ ] Enter token + new password
- [ ] Login với password mới
- [ ] Go to /profile
- [ ] Upload avatar
- [ ] Delete avatar

### **API Tests:**

- [ ] POST /auth/login → Get JWT token
- [ ] POST /advanced/forgot-password
- [ ] POST /advanced/reset-password
- [ ] POST /advanced/upload-avatar (với JWT)
- [ ] DELETE /advanced/delete-avatar (với JWT)

### **Error Tests:**

- [ ] Invalid credentials
- [ ] Non-existent email
- [ ] Invalid reset token
- [ ] No authorization header
- [ ] Wrong file type upload

---

## **🔥 READY-TO-USE ACCOUNTS:**

| Email              | Password  | Role  | Purpose        |
| ------------------ | --------- | ----- | -------------- |
| testuser@gmail.com | 123456789 | user  | Main testing   |
| admin@gmail.com    | 123456789 | admin | Admin features |

**Bạn có thể dùng ngay 2 accounts này để test tất cả tính năng! 🚀**

**Cần tạo thêm account nào không? Hoặc muốn tôi test thử một flow cụ thể nào không? 😊**
