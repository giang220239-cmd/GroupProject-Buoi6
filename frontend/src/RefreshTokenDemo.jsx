import React, { useState } from "react";
import axios from "axios";

const RefreshTokenDemo = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testRefreshToken = async () => {
    setLoading(true);
    setResult("Testing...");
    
    try {
      // Làm hỏng access token
      localStorage.setItem('accessToken', 'invalid_token_here');
      
      // Gọi API với invalid token để trigger refresh
      const response = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      setResult("✅ Auto refresh thành công! Token mới: " + localStorage.getItem('accessToken').substring(0, 50) + "...");
      
    } catch (error) {
      setResult("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🎯 Demo Auto Refresh Token</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Access Token hiện tại:</strong></p>
        <code style={{ wordBreak: "break-all", backgroundColor: "#f5f5f5", padding: "10px", display: "block" }}>
          {localStorage.getItem('accessToken')?.substring(0, 100) + "..." || "Chưa có token"}
        </code>
      </div>

      <button 
        onClick={testRefreshToken}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Đang test..." : "🚀 Test Auto Refresh Token"}
      </button>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
        <strong>Kết quả:</strong>
        <div style={{ marginTop: "10px", fontFamily: "monospace" }}>
          {result}
        </div>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <h3>📋 Cách hoạt động:</h3>
        <ol>
          <li>Set access token thành invalid</li>
          <li>Gọi API → nhận 401 Unauthorized</li>
          <li>Axios interceptor tự động gọi /auth/refresh</li>
          <li>Lấy access token mới và retry request</li>
        </ol>
      </div>
    </div>
  );
};

export default RefreshTokenDemo;