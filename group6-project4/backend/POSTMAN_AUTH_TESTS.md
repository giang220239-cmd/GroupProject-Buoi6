# Test Authentication APIs với Postman

## 1. Test POST /api/auth/signup

**URL:** `http://localhost:8080/api/auth/signup`
**Method:** POST
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Nguyễn Trường Giang",
  "email": "valheins0202@gmail.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyễn Trường Giang",
    "email": "valheins0202@gmail.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T...",
    "createdAt": "2025-10-11T..."
  }
}
```

## 2. Test POST /api/auth/login

**URL:** `http://localhost:8080/api/auth/login`
**Method:** POST
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "valheins0202@gmail.com",
  "password": "123456"
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyễn Trường Giang",
    "email": "valheins0202@gmail.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T...",
    "createdAt": "2025-10-11T..."
  }
}
```

## 3. Test POST /api/auth/logout

**URL:** `http://localhost:8080/api/auth/logout`
**Method:** POST
**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Đăng xuất thành công!"
}
```

## 4. Test GET /api/auth/me

**URL:** `http://localhost:8080/api/auth/me`
**Method:** GET
**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (Success):**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Nguyễn Trường Giang",
    "email": "valheins0202@gmail.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T...",
    "createdAt": "2025-10-11T...",
    "updatedAt": "2025-10-11T..."
  }
}
```

## 5. Test Error Cases

### Duplicate Email Signup:

Thử đăng ký lại với cùng email, should return:

```json
{
  "success": false,
  "message": "Email đã được sử dụng. Vui lòng chọn email khác."
}
```

### Wrong Login Credentials:

```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng."
}
```

### Missing Authorization Header:

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```
