import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setMessage({ type: "error", text: "Tên không được để trống" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: "error", text: "Email không hợp lệ" });
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      await axios.post("http://localhost:8080/api/users", { name, email });
      setName("");
      setEmail("");
      setMessage({ type: "success", text: `✅ Thêm user "${name}" thành công!` });
      
      if (onUserAdded) {
        onUserAdded();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      setMessage({ type: "error", text: "❌ Có lỗi xảy ra khi thêm user" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-container">
      <div className="card-header">
        <h2 className="card-title">➕ Thêm User Mới</h2>
      </div>
      
      <div className="card-body">
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              👤 Họ và Tên
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Nhập họ và tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Nhập địa chỉ email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Đang thêm...
              </>
            ) : (
              <>
                ➕ Thêm User
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
