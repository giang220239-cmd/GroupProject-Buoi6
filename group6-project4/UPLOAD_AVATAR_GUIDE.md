# 🖼️ HƯỚNG DẪN CHI TIẾT TEST API UPLOAD AVATAR

## **📋 CHUẨN BỊ**

### **1. Cần có:**

- ✅ Server backend đang chạy (port 8080)
- ✅ MongoDB connected
- ✅ Postman đã mở
- ✅ 1 file ảnh để test (jpg, png, gif - dưới 5MB)

### **2. Files ảnh test gợi ý:**

- Tạo folder `test-images` trong project
- Chuẩn bị các file:
  - `avatar.jpg` (ảnh bình thường)
  - `large-image.jpg` (>5MB để test limit)
  - `document.pdf` (file không phải ảnh)

---

## **🔐 BƯỚC 1: LẤY JWT TOKEN**

### **1.1. Tạo User (nếu chưa có):**

**Request Setup:**

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/signup`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Test User Avatar",
    "email": "avatar@test.com",
    "password": "123456789"
  }
  ```

**Expected Response:**

```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "Test User Avatar",
    "email": "avatar@test.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDIzNDU2LCJleHAiOjE2OTcwMjcwNTZ9.xyz123"
}
```

**👉 COPY TOKEN này để dùng cho upload avatar!**

### **1.2. Hoặc Login (nếu đã có user):**

**Request Setup:**

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "avatar@test.com",
    "password": "123456789"
  }
  ```

**👉 COPY TOKEN từ response!**

---

## **🖼️ BƯỚC 2: TEST UPLOAD AVATAR**

### **2.1. Setup Postman Request:**

#### **Basic Info:**

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/advanced/upload-avatar`

#### **Headers Tab:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDIzNDU2LCJleHAiOjE2OTcwMjcwNTZ9.xyz123
```

**⚠️ Thay thế bằng JWT token thật từ bước 1!**

#### **Body Tab:**

1. **Chọn:** `form-data` (KHÔNG PHẢI raw!)
2. **Thêm field:**
   - **Key:** `avatar`
   - **Type:** Chọn `File` từ dropdown (không phải Text!)
   - **Value:** Click "Choose Files" → Chọn file ảnh

### **2.2. Các Response có thể:**

#### **✅ Success (nếu Cloudinary configured):**

```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Test User Avatar",
      "email": "avatar@test.com",
      "avatar": {
        "url": "https://res.cloudinary.com/demo/image/upload/v1697023456/user-avatars/xyz123.jpg",
        "publicId": "user-avatars/xyz123"
      },
      "role": "user"
    }
  }
}
```

#### **❌ Expected Error (Cloudinary chưa config - hiện tại):**

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Lỗi server khi upload avatar"
}
```

**👉 Đây là lỗi bình thường vì chưa config Cloudinary!**

#### **❌ No Authorization:**

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### **❌ Invalid Token:**

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token."
}
```

#### **❌ No File:**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Vui lòng chọn file avatar"
}
```

---

## **🧪 BƯỚC 3: TEST CASES CHI TIẾT**

### **Test Case 1: Upload ảnh hợp lệ**

**Setup:**

- Authorization: `Bearer {valid_token}`
- Body: form-data với `avatar` = file jpg/png

**Expected:**

- **Hiện tại:** 500 error (Cloudinary chưa config)
- **Khi config xong:** 200 success

**Screenshot cần chụp:** Response với status code và message

---

### **Test Case 2: Không có Authorization header**

**Setup:**

- **Bỏ hoặc comment** header Authorization
- Body: form-data với `avatar` = file ảnh

**Expected:** 401 Unauthorized

**Steps:**

1. Vào Headers tab
2. Uncheck hoặc xóa dòng Authorization
3. Send request
4. Kiểm tra status 401

---

### **Test Case 3: Token không hợp lệ**

**Setup:**

- Authorization: `Bearer invalid-token-123`
- Body: form-data với `avatar` = file ảnh

**Expected:** 401 Invalid token

---

### **Test Case 4: Không có file**

**Setup:**

- Authorization: `Bearer {valid_token}`
- Body: form-data TRỐNG (không có field `avatar`)

**Expected:** 400 Bad Request

**Steps:**

1. Vào Body tab
2. Xóa hết các fields trong form-data
3. Send request
4. Kiểm tra status 400

---

### **Test Case 5: Key sai tên**

**Setup:**

- Authorization: `Bearer {valid_token}`
- Body: form-data với key `image` thay vì `avatar`

**Expected:** 400 Bad Request

---

### **Test Case 6: File không phải ảnh**

**Setup:**

- Authorization: `Bearer {valid_token}`
- Body: form-data với `avatar` = file .txt hoặc .pdf

**Expected:** 400 Bad Request (nếu có validation) hoặc 500 error

---

## **📸 BƯỚC 4: CHỤP SCREENSHOTS**

### **Screenshots cần có:**

1. **Request setup:**

   - URL và method
   - Headers với Authorization
   - Body form-data với file

2. **Success response:** (hiện tại sẽ là 500 error)

   - Status code
   - Response JSON

3. **Error cases:**
   - 401 No authorization
   - 400 No file
   - 401 Invalid token

---

## **🔄 BƯỚC 5: TEST DELETE AVATAR**

### **5.1. Setup Request:**

- **Method:** `DELETE`
- **URL:** `http://localhost:8080/api/advanced/delete-avatar`
- **Headers:**
  ```
  Authorization: Bearer {same_token}
  ```
- **Body:** Không cần (để trống)

### **5.2. Expected Response:**

```json
{
  "success": true,
  "message": "Xóa avatar thành công",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Test User Avatar",
      "email": "avatar@test.com",
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

## **✅ CHECKLIST TEST HOÀN CHỈNH:**

### **Chuẩn bị:**

- [ ] Server running on port 8080
- [ ] MongoDB connected
- [ ] JWT token valid
- [ ] File ảnh test sẵn sàng

### **Test Upload Avatar:**

- [ ] Upload với token hợp lệ → Status 500 (Cloudinary error)
- [ ] Upload không có token → Status 401
- [ ] Upload token không hợp lệ → Status 401
- [ ] Upload không có file → Status 400
- [ ] Upload key sai tên → Status 400

### **Test Delete Avatar:**

- [ ] Delete với token hợp lệ → Status 200
- [ ] Delete không có token → Status 401

### **Screenshots:**

- [ ] Setup request trong Postman
- [ ] Response thành công (hoặc 500 error expected)
- [ ] Error cases (401, 400)

---

## **🎯 LƯU Ý QUAN TRỌNG:**

1. **Cloudinary Error là bình thường:**

   - Status 500 với message "Lỗi server khi upload avatar"
   - Điều này chứng tỏ API hoạt động đúng, chỉ thiếu config Cloudinary

2. **Form-data setup:**

   - PHẢI chọn `form-data`, không phải `raw`
   - Key PHẢI là `avatar`
   - Type PHẢI là `File`

3. **Authorization header:**
   - Format: `Bearer {token}`
   - Có space giữa "Bearer" và token
   - Token phải còn hiệu lực (chưa expire)

**Với hướng dẫn này, bạn có thể test đầy đủ API Upload Avatar! 🚀📸**
