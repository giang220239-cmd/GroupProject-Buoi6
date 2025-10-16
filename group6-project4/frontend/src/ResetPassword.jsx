import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  // Verify token khi component mount
  useEffect(() => {
    if (!token) {
      setMessage("Token không hợp lệ hoặc thiếu");
      setTokenValid(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/advanced/verify-reset-token/${token}`
      );
      const data = await response.json();

      if (data.success) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setMessage(data.message || "Token không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      console.error("Verify token error:", error);
      setTokenValid(false);
      setMessage("Không thể xác thực token. Vui lòng thử lại!");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(""); // Clear message when user types
  };

  const validateForm = () => {
    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/advanced/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.message || "Đặt lại mật khẩu thành công!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setSuccess(false);
        setMessage(data.message || "Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setSuccess(false);
      setMessage("Không thể kết nối đến server. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: "Yếu", color: "#dc3545" };
    if (password.length < 8)
      return { level: 2, text: "Trung bình", color: "#ffc107" };
    if (password.length >= 8 && /(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      return { level: 3, text: "Mạnh", color: "#28a745" };
    }
    return { level: 2, text: "Khá", color: "#17a2b8" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // Show loading while verifying token
  if (tokenValid === null) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-container">
            <div className="loading-spinner-large">⏳</div>
            <h3>Đang xác thực token...</h3>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token invalid
  if (tokenValid === false) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Token không hợp lệ</h3>
            <p>{message}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="retry-btn"
            >
              🔄 Yêu cầu lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h2>🔐 Đặt Lại Mật Khẩu</h2>
          <p>Nhập mật khẩu mới để hoàn tất quá trình đặt lại</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">🔒 Mật khẩu mới</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || success}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.level / 3) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
                <span style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">🔐 Xác nhận mật khẩu</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading || success}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <div className="error-hint">❌ Mật khẩu không khớp</div>
              )}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword &&
              formData.confirmPassword.length >= 6 && (
                <div className="success-hint">✅ Mật khẩu khớp</div>
              )}
          </div>

          {message && !success && (
            <div className="message error">
              <span className="message-icon">❌</span>
              {message}
            </div>
          )}

          {success && (
            <div className="message success">
              <span className="message-icon">✅</span>
              {message}
              <div className="redirect-info">
                <small>Đang chuyển hướng đến trang đăng nhập...</small>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              success ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
          >
            {loading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Đang xử lý...
              </>
            ) : success ? (
              <>
                <span>✅</span>
                Thành công!
              </>
            ) : (
              "🚀 Đặt lại mật khẩu"
            )}
          </button>

          <div className="reset-password-footer">
            <p>
              Nhớ mật khẩu?
              <a href="/login" className="login-link">
                {" "}
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
