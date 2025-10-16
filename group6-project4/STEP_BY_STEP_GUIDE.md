# 🚀 HƯỚNG DẪN CHI TIẾT: TỪ SIGNUP ĐĐN UPLOAD AVATAR

## **🔐 BƯỚC 1: SIGNUP ĐỂ LẤY JWT TOKEN**

### **1.1. Mở Postman và tạo request mới**

1. **Mở Postman**
2. **Click "New" → "Request"**
3. **Đặt tên:** `01 - Signup for Avatar Test`
4. **Chọn collection** hoặc tạo mới

### **1.2. Setup Request Signup**

#### **Method và URL:**

- **Method:** Chọn `POST` từ dropdown
- **URL:** Copy paste: `http://localhost:8080/api/auth/signup`

#### **Headers Tab:**

1. **Click vào tab "Headers"**
2. **Thêm header:**
   - **Key:** `Content-Type`
   - **Value:** `application/json`

#### **Body Tab:**

1. **Click vào tab "Body"**
2. **Chọn radio button "raw"**
3. **Chọn "JSON" từ dropdown bên phải**
4. **Copy paste JSON này vào ô text:**

```json
{
  "name": "Avatar Test User",
  "email": "avatartest@gmail.com",
  "password": "123456789"
}
```

### **1.3. Gửi Request Signup**

1. **Click nút "Send" màu xanh**
2. **Đợi response (1-2 giây)**

### **1.4. Kiểm tra Response**

#### **✅ Success Response (Status 201):**

```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "Avatar Test User",
    "email": "avatartest@gmail.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-10-11T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDIzNDU2LCJleHAiOjE2OTcwMjcwNTZ9.xyz123abc456def"
}
```

### **1.5. COPY JWT TOKEN**

1. **Tìm dòng "token" trong response**
2. **Copy toàn bộ giá trị token** (bao gồm cả dấu ngoặc kép)
3. **Paste vào notepad tạm** để dùng cho bước tiếp theo

**Ví dụ token:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDIzNDU2LCJleHAiOjE2OTcwMjcwNTZ9.xyz123abc456def
```

**⚠️ LƯU Ý:**

- Token này có hiệu lực **1 giờ**
- **KHÔNG** copy dấu ngoặc kép `""`
- **CHỈ** copy nội dung bên trong

---

## **🖼️ BƯỚC 2: SETUP UPLOAD AVATAR REQUEST**

### **2.1. Tạo Request mới cho Upload Avatar**

1. **Click "New" → "Request" trong Postman**
2. **Đặt tên:** `02 - Upload Avatar`
3. **Save vào cùng collection**

### **2.2. Setup Method và URL**

#### **Method và URL:**

- **Method:** Chọn `POST` từ dropdown
- **URL:** Copy paste: `http://localhost:8080/api/advanced/upload-avatar`

### **2.3. Setup Headers**

1. **Click vào tab "Headers"**
2. **Thêm header Authorization:**
   - **Key:** `Authorization`
   - **Value:** `Bearer ` + token vừa copy

**Ví dụ value hoàn chỉnh:**

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3MDIzNDU2LCJleHAiOjE2OTcwMjcwNTZ9.xyz123abc456def
```

**⚠️ QUAN TRỌNG:**

- **PHẢI có từ "Bearer "** (có dấu space)
- **KHÔNG có dấu ngoặc kép**
- Format: `Bearer {token}`

### **2.4. Setup Body cho Upload File**

#### **Chọn Body Type:**

1. **Click vào tab "Body"**
2. **Chọn radio button "form-data"** (KHÔNG phải raw!)

#### **Thêm Field Avatar:**

1. **Trong bảng form-data:**

   - **Key:** Gõ `avatar`
   - **Type:** Click dropdown → Chọn `File` (không phải Text!)
   - **Value:** Click "Choose Files"

2. **Chọn file ảnh:**
   - Chọn 1 file ảnh (jpg, png, gif)
   - Kích thước < 5MB
   - **Ví dụ:** `avatar.jpg`, `profile.png`

#### **Kiểm tra Setup:**

Sau khi setup xong, bạn sẽ thấy:

- Key: `avatar`
- Type: `File`
- Value: Tên file đã chọn (ví dụ: `avatar.jpg`)

---

## **🧪 BƯỚC 3: TEST UPLOAD AVATAR**

### **3.1. Gửi Request lần đầu**

1. **Đảm bảo:**

   - ✅ URL đúng: `/advanced/upload-avatar`
   - ✅ Method: POST
   - ✅ Headers có Authorization với Bearer token
   - ✅ Body: form-data với key `avatar` type `File`
   - ✅ File ảnh đã được chọn

2. **Click "Send"**

### **3.2. Các Response có thể gặp:**

#### **✅ Response hiện tại (Cloudinary chưa config):**

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Lỗi server khi upload avatar"
}
```

**👉 Đây là kết quả MONG MUỐN hiện tại!**

#### **❌ Nếu thiếu Authorization:**

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### **❌ Nếu token không hợp lệ:**

**Status:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid token."
}
```

#### **❌ Nếu không có file:**

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Vui lòng chọn file avatar"
}
```

### **3.3. Troubleshooting các lỗi thường gặp:**

#### **Lỗi 401 - No token provided:**

**Nguyên nhân:** Thiếu hoặc sai Authorization header
**Giải pháp:**

1. Kiểm tra tab Headers có dòng Authorization không
2. Kiểm tra format: `Bearer {token}` (có space sau Bearer)
3. Kiểm tra token không có dấu ngoặc kép

#### **Lỗi 401 - Invalid token:**

**Nguyên nhân:** Token hết hạn hoặc sai
**Giải pháp:**

1. Quay lại Bước 1 để lấy token mới
2. Copy lại token mới vào Authorization header

#### **Lỗi 400 - Vui lòng chọn file:**

**Nguyên nhân:** Không có file hoặc key sai
**Giải pháp:**

1. Kiểm tra Body type là `form-data`
2. Kiểm tra Key phải là `avatar`
3. Kiểm tra Type phải là `File`
4. Chọn lại file ảnh

---

## **📸 BƯỚC 4: CHỤP SCREENSHOTS**

### **Screenshots cần có:**

#### **4.1. Setup Request:**

- Request URL và method
- Headers tab với Authorization
- Body tab với form-data setup

#### **4.2. Response thành công:**

- Status code (500 expected)
- Response JSON message

#### **4.3. Test error cases:**

- Remove Authorization → 401 error
- Remove file → 400 error

---

## **✅ CHECKLIST HOÀN THÀNH:**

### **Bước 1 - Signup:**

- [ ] Request setup đúng (POST /auth/signup)
- [ ] Headers có Content-Type: application/json
- [ ] Body JSON với name, email, password
- [ ] Response status 201
- [ ] Copy được JWT token

### **Bước 2 - Upload Avatar:**

- [ ] Request setup đúng (POST /advanced/upload-avatar)
- [ ] Headers có Authorization: Bearer {token}
- [ ] Body type: form-data
- [ ] Key: avatar, Type: File, Value: ảnh đã chọn
- [ ] Response status 500 (expected Cloudinary error)

### **Error Testing:**

- [ ] Test không có Authorization → 401
- [ ] Test không có file → 400
- [ ] Screenshots đầy đủ

---

## **🎯 TÓM TẮT NHANH:**

```
1. POST /auth/signup → Copy token
2. POST /advanced/upload-avatar
   - Headers: Authorization: Bearer {token}
   - Body: form-data, key=avatar, type=File
3. Expected: 500 error (Cloudinary chưa config)
4. Test error cases: 401, 400
```

**Với hướng dẫn này, bạn có thể test từ signup đến upload avatar một cách chi tiết! 🚀📸**
