# Test Authentication APIs với PowerShell/curl

## 1. Test API Signup

```powershell
# Test đăng ký user mới
$signupData = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test123456"
    confirmPassword = "Test123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method POST -ContentType "application/json" -Body $signupData
```

## 2. Test API Login

```powershell
# Test đăng nhập
$loginData = @{
    email = "test@example.com"
    password = "Test123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData

# Lưu token để sử dụng cho các request khác
$token = $loginResponse.token
Write-Host "JWT Token: $token"
```

## 3. Test API with Authentication

```powershell
# Test API cần authentication (thêm Authorization header)
$headers = @{
    "Authorization" = "Bearer $token"
}

# Test get profile
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method GET -Headers $headers

# Test verify token
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/verify" -Method GET -Headers $headers

# Test logout
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" -Method POST -Headers $headers
```

## 4. Test User Management APIs

```powershell
# Get all users
Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method GET

# Add new user (qua user management)
$userData = @{
    name = "Admin User"
    email = "admin@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method POST -ContentType "application/json" -Body $userData
```

## Expected Responses:

### Signup Success:

```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "avatar": "",
    "lastLogin": "2025-10-11T...",
    "createdAt": "2025-10-11T..."
  }
}
```

### Login Success:

```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Email đã được sử dụng. Vui lòng chọn email khác."
}
```
