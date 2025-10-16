# Test Admin APIs với Postman

## Chuẩn bị

1. Tạo admin user để test
2. Đăng nhập để lấy admin JWT token
3. Sử dụng token trong tất cả requests

## 1. Tạo Admin User Đầu Tiên

**URL:** `http://localhost:8080/api/admin/setup`
**Method:** POST
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Admin user created successfully!",
  "user": {
    "id": "...",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2025-10-11T..."
  }
}
```

**Error Response (Admin exists):**

```json
{
  "success": false,
  "message": "Admin user already exists. This endpoint is disabled."
}
```

## 2. Đăng Nhập Admin

**URL:** `http://localhost:8080/api/auth/login`
**Method:** POST
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Copy JWT token từ response để sử dụng cho các test tiếp theo**

## 3. Test GET /api/admin/users (Admin Only)

**URL:** `http://localhost:8080/api/admin/users`
**Method:** GET
**Headers:**

```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

**Query Parameters (Optional):**

- `page=1`
- `limit=20`
- `search=test`
- `role=admin`

**Expected Response (Success):**

```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "name": "Super Admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "",
      "isActive": true,
      "lastLogin": "2025-10-11T...",
      "createdAt": "2025-10-11T...",
      "updatedAt": "2025-10-11T..."
    },
    {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "lastLogin": "2025-10-11T...",
      "createdAt": "2025-10-11T...",
      "updatedAt": "2025-10-11T..."
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 2,
    "limit": 20
  }
}
```

## 4. Test DELETE /api/admin/users/:id (Admin or Owner)

**URL:** `http://localhost:8080/api/admin/users/USER_ID_HERE`
**Method:** DELETE
**Headers:**

```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "User \"Test User\" deleted successfully.",
  "deletedUser": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**Error Response (Cannot delete last admin):**

```json
{
  "success": false,
  "message": "Cannot delete the last admin user."
}
```

## 5. Test PUT /api/admin/users/:id/role (Admin Only)

**URL:** `http://localhost:8080/api/admin/users/USER_ID_HERE/role`
**Method:** PUT
**Headers:**

```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

**Body (Promote to Admin):**

```json
{
  "role": "admin"
}
```

**Body (Demote to User):**

```json
{
  "role": "user"
}
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "User role updated to admin successfully.",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "admin",
    "avatar": "",
    "isActive": true,
    "lastLogin": "2025-10-11T...",
    "createdAt": "2025-10-11T...",
    "updatedAt": "2025-10-11T..."
  }
}
```

## 6. Test Error Cases

### 403 Forbidden (Non-Admin User):

**Test với user token thay vì admin token:**

```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### 401 Unauthorized (No Token):

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found (Invalid User ID):

```json
{
  "success": false,
  "message": "User not found."
}
```

### 400 Bad Request (Invalid Role):

**Body:**

```json
{
  "role": "invalid_role"
}
```

**Response:**

```json
{
  "success": false,
  "message": "Invalid role. Must be 'user' or 'admin'."
}
```

## 7. Test RBAC (Role-Based Access Control)

### Test Regular User Routes:

1. **GET /api/users** - Nên trả về lỗi 403 với user token
2. **POST /api/users** - Nên trả về lỗi 403 với user token
3. **PUT /api/users/:id** - Chỉ owner hoặc admin mới được phép
4. **DELETE /api/users/:id** - Chỉ owner hoặc admin mới được phép

### Test Cases cho ownerOrAdminAuth:

1. **User sửa thông tin chính mình** - ✅ Cho phép
2. **User sửa thông tin người khác** - ❌ Từ chối
3. **Admin sửa thông tin bất kỳ ai** - ✅ Cho phép

## 8. Test Workflow

### Workflow 1: Admin Management

1. Tạo admin user (`POST /api/admin/setup`)
2. Đăng nhập admin (`POST /api/auth/login`)
3. Xem danh sách users (`GET /api/admin/users`)
4. Tạo user mới (`POST /api/users`)
5. Promote user thành admin (`PUT /api/admin/users/:id/role`)
6. Xóa user (`DELETE /api/admin/users/:id`)

### Workflow 2: Permission Testing

1. Đăng nhập với user thường (`POST /api/auth/login`)
2. Thử truy cập admin endpoints (`GET /api/admin/users`) - Nên bị từ chối
3. Thử sửa thông tin người khác (`PUT /api/users/:otherId`) - Nên bị từ chối
4. Sửa thông tin chính mình (`PUT /api/users/:ownId`) - Nên được phép

## 9. Frontend Integration Test

Sau khi APIs hoạt động:

1. Đăng nhập với tài khoản admin
2. Truy cập `/admin` route
3. Kiểm tra danh sách users hiển thị đúng
4. Test các chức năng:
   - Tìm kiếm users
   - Filter theo role
   - Thay đổi role của user
   - Xóa user
   - Refresh danh sách

## 10. Security Checklist

- ✅ JWT token bắt buộc cho tất cả protected routes
- ✅ Admin role required cho admin endpoints
- ✅ Owner/Admin check cho user-specific operations
- ✅ Cannot delete last admin
- ✅ Cannot demote last admin
- ✅ Proper error messages không leak sensitive info
- ✅ Input validation cho role updates
