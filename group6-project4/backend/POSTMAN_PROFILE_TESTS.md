# Test Profile APIs với Postman

## Chuẩn bị

1. Đảm bảo đã có JWT token từ login
2. Copy token và sử dụng trong Authorization header

## 1. Test GET /api/profile

**URL:** `http://localhost:8080/api/profile`
**Method:** GET
**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (Success):**

```json
{
  "success": true,
  "profile": {
    "id": "68e77cef02d0364685d453fb",
    "name": "Nguyễn Trường Giang",
    "email": "giang.test@gmail.com",
    "role": "user",
    "avatar": "",
    "isActive": true,
    "lastLogin": "2025-10-11T09:50:37.336Z",
    "createdAt": "2025-10-11T09:50:37.336Z",
    "updatedAt": "2025-10-11T09:50:37.336Z"
  }
}
```

**Error Response (No token):**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Error Response (Invalid token):**

```json
{
  "success": false,
  "message": "Invalid token."
}
```

## 2. Test PUT /api/profile

**URL:** `http://localhost:8080/api/profile`
**Method:** PUT
**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (raw JSON) - Update Name:**

```json
{
  "name": "Nguyễn Trường Giang Updated"
}
```

**Body (raw JSON) - Update Name & Avatar:**

```json
{
  "name": "Nguyễn Trường Giang",
  "avatar": "https://via.placeholder.com/150x150?text=Avatar"
}
```

**Body (raw JSON) - Update All Fields:**

```json
{
  "name": "Nguyễn Trường Giang Full Update",
  "email": "giang.updated@gmail.com",
  "avatar": "https://avatars.githubusercontent.com/u/1234567?v=4"
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Cập nhật thông tin profile thành công!",
  "profile": {
    "id": "68e77cef02d0364685d453fb",
    "name": "Nguyễn Trường Giang Full Update",
    "email": "giang.updated@gmail.com",
    "role": "user",
    "avatar": "https://avatars.githubusercontent.com/u/1234567?v=4",
    "isActive": true,
    "lastLogin": "2025-10-11T09:50:37.336Z",
    "createdAt": "2025-10-11T09:50:37.336Z",
    "updatedAt": "2025-10-11T10:15:22.445Z"
  }
}
```

## 3. Test Error Cases

### Empty Name:

**Body:**

```json
{
  "name": "",
  "email": "test@gmail.com"
}
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "Tên không được để trống",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Invalid Email:

**Body:**

```json
{
  "name": "Test User",
  "email": "invalid-email"
}
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "Email không hợp lệ",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Duplicate Email (if trying to change to existing email):

**Expected Response:**

```json
{
  "success": false,
  "message": "Email đã được sử dụng bởi user khác"
}
```

## 4. Test POST /api/profile/avatar (Placeholder)

**URL:** `http://localhost:8080/api/profile/avatar`
**Method:** POST
**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Avatar upload feature will be implemented later",
  "avatarUrl": "https://via.placeholder.com/150x150?text=Avatar"
}
```

## 5. Test Workflow

### Recommended Test Order:

1. **Login** → Get JWT token
2. **GET /api/profile** → View current profile
3. **PUT /api/profile** → Update name only
4. **GET /api/profile** → Verify name updated
5. **PUT /api/profile** → Update email and avatar
6. **GET /api/profile** → Verify all fields updated
7. **PUT /api/profile** → Try invalid data (test validation)
8. **POST /api/profile/avatar** → Test avatar upload placeholder

### Validation Test Cases:

- Empty name
- Invalid email format
- Too long name (>100 characters)
- Invalid avatar URL format
- Try to update to existing email of another user

## 6. Integration with Frontend

Sau khi test API thành công, test trên frontend:

1. Đăng nhập vào hệ thống
2. Điều hướng đến trang Profile (`/profile`)
3. Xem thông tin profile hiển thị
4. Click "Chỉnh Sửa Thông Tin"
5. Cập nhật thông tin và submit
6. Verify thông tin đã được cập nhật
7. Test logout function
