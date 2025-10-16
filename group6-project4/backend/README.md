# Backend - User Management API

## Mô tả

Backend API cho hệ thống quản lý User sử dụng Node.js, Express và MongoDB.

## Công nghệ sử dụng

- **Node.js**: Runtime JavaScript
- **Express**: Web framework
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **Mongoose**: MongoDB ODM
- **CORS**: Cho phép frontend kết nối

## Cấu trúc thư mục

```
backend/
├── controllers/        # Logic xử lý business
├── models/            # Models MongoDB
├── routes/            # Định nghĩa API routes
├── server.js          # File khởi động server
├── package.json       # Dependencies
├── .env              # Biến môi trường
└── README.md         # Tài liệu này
```

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình môi trường
File `.env` đã được tạo với:
```
PORT=8080
MONGO_URI=mongodb+srv://nhom_6:0123456789@cluster0.hnybrg4.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Chạy server
```bash
node server.js
```

Server sẽ chạy tại: `http://localhost:8080`

## API Endpoints

### Users
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy user theo ID
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

## Lỗi thường gặp

### MongoDB Connection Error
Nếu gặp lỗi: `The uri parameter to openUri() must be a string, got "undefined"`

**Nguyên nhân**: File `.env` không được tải đúng cách

**Giải pháp**: Đảm bảo file `.env` tồn tại trong thư mục `backend/` và chứa `MONGO_URI`

