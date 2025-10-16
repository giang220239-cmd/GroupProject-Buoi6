import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation trước khi gửi
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Tên không được để trống" });
      return;
    }
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email không được để trống" });
      return;
    }
    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu phải có ít nhất 6 ký tự" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Xác nhận mật khẩu không khớp" });
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      // Lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setMessage({
        type: "success",
        text: response.data.message || "Đăng ký thành công!",
      });

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Đăng ký thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">🔐 Đăng Ký Tài Khoản</h2>
          <p className="signup-subtitle">
            Tạo tài khoản mới để sử dụng hệ thống
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              👤 Họ và Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập họ và tên của bạn..."
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập địa chỉ email..."
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔒 Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              🔒 Xác Nhận Mật Khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Đang đăng ký...
              </>
            ) : (
              <>✨ Đăng Ký</>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Đã có tài khoản? <a href="/login">Đăng nhập tại đây</a>
          </p>
        </div>
      </div>

      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage("")}
        />
      )}
    </div>
  );
};

export default SignUp;
