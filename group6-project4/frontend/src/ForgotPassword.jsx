import React, { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/advanced/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(
          data.message || "Email hướng dẫn đặt lại mật khẩu đã được gửi!"
        );
        setEmail("");
      } else {
        setSuccess(false);
        setMessage(data.message || "Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setSuccess(false);
      setMessage("Không thể kết nối đến server. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>🔐 Quên Mật Khẩu</h2>
          <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div className={`message ${success ? "success" : "error"}`}>
              <span className="message-icon">{success ? "✅" : "❌"}</span>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Đang gửi...
              </>
            ) : (
              "🚀 Gửi Email"
            )}
          </button>

          <div className="forgot-password-footer">
            <p>
              Nhớ mật khẩu?
              <a href="/login" className="login-link">
                {" "}
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>

        {success && (
          <div className="success-info">
            <h4>📬 Email đã được gửi!</h4>
            <ul>
              <li>✓ Kiểm tra hộp thư đến của bạn</li>
              <li>✓ Link reset có hiệu lực trong 10 phút</li>
              <li>✓ Kiểm tra thư mục spam nếu không thấy email</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
