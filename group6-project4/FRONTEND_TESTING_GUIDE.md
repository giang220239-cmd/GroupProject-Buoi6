# 🎨 FRONTEND TESTING GUIDE - ADVANCED FEATURES

## 🚀 **Khởi chạy Frontend**

### **1. Chạy Frontend Development Server:**

```bash
cd frontend
npm start
```

Frontend sẽ chạy trên: `http://localhost:3000`

### **2. Đảm bảo Backend đang chạy:**

Backend đang chạy trên: `http://localhost:8080` ✅

---

## 📸 **Screenshots cần chụp:**

### **1. 🔐 FORGOT PASSWORD FORM**

#### **Truy cập:**

- URL: `http://localhost:3000/forgot-password`
- Hoặc từ Login page → click "🔐 Quên mật khẩu?"

#### **Test Cases:**

1. **Form trống** - hiển thị placeholder và validation
2. **Email không hợp lệ** - hiển thị lỗi validation
3. **Email không tồn tại** - hiển thị message lỗi từ API
4. **Email hợp lệ** - hiển thị success message và hướng dẫn

#### **Screenshots:**

- Form ban đầu với design đẹp
- Loading state khi đang gửi
- Success message với thông tin chi tiết
- Error message khi email không tồn tại

---

### **2. 🔄 RESET PASSWORD FORM**

#### **Truy cập:**

- URL: `http://localhost:3000/reset-password?token=YOUR_TOKEN`
- Token lấy từ database sau khi forgot password

#### **Test Cases:**

1. **Token không hợp lệ** - hiển thị error page
2. **Form reset password** - với password strength indicator
3. **Password không khớp** - hiển thị validation error
4. **Reset thành công** - hiển thị success và redirect

#### **Screenshots:**

- Loading state khi verify token
- Error page với token không hợp lệ
- Form reset password với password strength
- Success page với auto redirect countdown

---

### **3. 🖼️ AVATAR UPLOAD COMPONENT**

#### **Truy cập:**

- URL: `http://localhost:3000/profile`
- Cần đăng nhập trước

#### **Test Cases:**

1. **Profile ban đầu** - hiển thị avatar placeholder
2. **Drag & Drop area** - với hover effects
3. **File selection** - preview ảnh trước upload
4. **Upload progress** - loading state
5. **Upload success** - avatar mới hiển thị
6. **Delete avatar** - confirm và xóa thành công

#### **Screenshots:**

- Profile page với avatar upload section
- Drag & drop area với hover effect
- Preview ảnh trước khi upload
- Upload progress với loading spinner
- Avatar mới sau khi upload thành công
- Confirmation dialog khi delete avatar

---

## 🛠️ **Test Data chuẩn bị:**

### **1. User Account:**

```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### **2. Test Images:**

- Chuẩn bị 2-3 file ảnh (jpg, png) kích thước khác nhau
- 1 file không phải ảnh để test validation
- 1 file quá lớn (>5MB) để test size limit

### **3. Reset Tokens:**

- Tạo forgot password để có token hợp lệ
- Sử dụng token fake để test invalid token

---

## 📱 **Responsive Testing:**

### **Desktop (1920x1080):**

- Full layout với sidebar/navigation
- Hover effects và animations

### **Tablet (768px):**

- Responsive layout adjustments
- Touch-friendly interactions

### **Mobile (375px):**

- Mobile-optimized forms
- Stack layout cho avatar upload

---

## 🎨 **UI Elements cần highlight:**

### **Design Features:**

- ✅ Gradient backgrounds
- ✅ Glassmorphism effects
- ✅ Smooth animations
- ✅ Loading spinners
- ✅ Error/success states
- ✅ Password strength indicator
- ✅ Drag & drop visuals
- ✅ Toast notifications

### **Interactive Elements:**

- ✅ Form validation real-time
- ✅ Password show/hide toggle
- ✅ File drag & drop
- ✅ Progress indicators
- ✅ Confirmation dialogs
- ✅ Auto-redirect timers

---

## 📝 **Testing Checklist:**

### **Forgot Password:**

- [ ] Form validation hoạt động
- [ ] Loading state hiển thị
- [ ] Success message chi tiết
- [ ] Error handling đúng
- [ ] Link back to login

### **Reset Password:**

- [ ] Token verification works
- [ ] Password strength indicator
- [ ] Show/hide password toggle
- [ ] Validation real-time
- [ ] Success redirect to login

### **Avatar Upload:**

- [ ] Drag & drop functionality
- [ ] File type validation
- [ ] Size limit enforcement
- [ ] Preview before upload
- [ ] Upload progress indication
- [ ] Delete confirmation
- [ ] Error handling

### **Overall UX:**

- [ ] Consistent design language
- [ ] Smooth transitions
- [ ] Mobile responsiveness
- [ ] Accessibility features
- [ ] Loading states everywhere
- [ ] Clear error messages

---

## 🎯 **Pro Tips cho Screenshots:**

1. **Sử dụng Chrome DevTools** để test responsive
2. **Clear browser cache** trước khi test
3. **Prepare test data** trước để demo mượt mà
4. **Test cả success và error flows**
5. **Capture loading states** để show UX tốt
6. **Highlight animations** bằng slow motion nếu cần

**Frontend sẵn sàng cho testing và screenshots! 📸✨**
