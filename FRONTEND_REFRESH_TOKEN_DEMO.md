# Demo Frontend Tự Refresh Token

## 1. Chuẩn bị
- Chạy backend: `cd backend && npm start`
- Chạy frontend: `cd frontend && npm start`
- Mở trình duyệt tại `http://localhost:3000`

## 2. Demo Tự động Refresh Token

### Bước 1: Đăng nhập
1. Truy cập `http://localhost:3000/login`
2. Đăng nhập với tài khoản hợp lệ
3. Kiểm tra `localStorage` trong Developer Tools:
   - `accessToken`: JWT Access Token
   - `refreshToken`: JWT Refresh Token

### Bước 2: Truy cập trang được bảo vệ
1. Truy cập `http://localhost:3000/profile` hoặc `http://localhost:3000/admin`
2. Trang sẽ tự động kiểm tra token trong `ProtectedRoute`
3. Nếu không có token → chuyển hướng về `/login`

### Bước 3: Demo Auto Refresh Token
1. Mở Developer Tools → Network Tab
2. Thực hiện các action gọi API (ví dụ: cập nhật profile)
3. Quan sát request/response:
   - Nếu Access Token hết hạn → status 401
   - Axios interceptor tự động gọi `/auth/refresh`
   - Lấy Access Token mới và retry request gốc

### Bước 4: Kiểm tra trong Console
```javascript
// Trong Developer Tools Console
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

## 3. Code Demo

### Axios Interceptor (đã implement trong App.js)
```javascript
// Tự động refresh token khi nhận 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        localStorage.setItem("accessToken", data.accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
```

### Protected Route (ProtectedRoute.jsx)
```javascript
const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

## 4. Các bước chụp video/ảnh demo

### Video Demo:
1. **Đăng nhập**: Hiển thị quá trình đăng nhập và lưu token
2. **Kiểm tra LocalStorage**: Mở Developer Tools, hiển thị token
3. **Truy cập Protected Route**: Vào `/profile` thành công
4. **Xóa Access Token**: Xóa accessToken trong localStorage
5. **Retry Request**: Gọi API → tự động refresh → thành công
6. **Logout**: Xóa hết token và chuyển về login

### Screenshots cần chụp:
1. Login page với form đăng nhập
2. Developer Tools hiển thị tokens trong localStorage
3. Protected route `/profile` hiển thị thành công
4. Network tab hiển thị auto refresh token call
5. Console logs hiển thị token refresh process