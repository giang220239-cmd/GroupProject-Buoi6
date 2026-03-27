import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RBAC.css";

const RBACDemo = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUserRole();
    fetchUsers();
    fetchStats();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/api/rbac/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        setMessage("❌ Bạn không có quyền xem danh sách users (Admin only)");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/api/rbac/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 403) {
        setMessage("❌ Bạn không có quyền xem thống kê (Admin/Moderator only)");
      }
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8080/api/rbac/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Đã thay đổi role thành ${newRole}`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8080/api/rbac/users/${userId}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Đã ${isActive ? "kích hoạt" : "vô hiệu hóa"} user`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/rbac/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Đã xóa user");
      fetchUsers();
      fetchStats();
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "moderator":
        return "badge-moderator";
      case "user":
        return "badge-user";
      default:
        return "badge-default";
    }
  };

  if (!currentUser) {
    return (
      <div className="rbac-container">
        <h2>🔐 RBAC Demo - Role-Based Access Control</h2>
        <p>Vui lòng đăng nhập để sử dụng tính năng này.</p>
        <a href="/login">Đăng nhập</a>
      </div>
    );
  }

  return (
    <div className="rbac-container">
      <h2>🔐 RBAC Demo - Role-Based Access Control</h2>

      {/* Current User Info */}
      <div className="user-info-card">
        <h3>👤 Thông tin người dùng hiện tại</h3>
        <p>
          <strong>Tên:</strong> {currentUser.name}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span className={`badge ${getRoleBadgeColor(currentUser.role)}`}>
            {currentUser.role}
          </span>
        </p>
      </div>

      {/* Permission Matrix */}
      <div className="permission-matrix">
        <h3>📋 Ma trận quyền hạn</h3>
        <table>
          <thead>
            <tr>
              <th>Chức năng</th>
              <th>User</th>
              <th>Moderator</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Xem danh sách users</td>
              <td>❌</td>
              <td>❌</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Thay đổi role</td>
              <td>❌</td>
              <td>❌</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Kích hoạt/vô hiệu user</td>
              <td>❌</td>
              <td>✅</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Xóa user</td>
              <td>❌</td>
              <td>❌</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Xem thống kê</td>
              <td>❌</td>
              <td>✅</td>
              <td>✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Stats (Admin & Moderator only) */}
      {stats &&
        (currentUser.role === "admin" || currentUser.role === "moderator") && (
          <div className="stats-card">
            <h3>📊 Thống kê Users</h3>
            <p>
              <strong>Tổng số users:</strong> {stats.total}
            </p>
            <div className="stats-grid">
              {stats.byRole.map((roleStats) => (
                <div key={roleStats._id} className="stat-item">
                  <span className={`badge ${getRoleBadgeColor(roleStats._id)}`}>
                    {roleStats._id}
                  </span>
                  <span>
                    {roleStats.count} users ({roleStats.active} active)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Users List (Admin only) */}
      {currentUser.role === "admin" && (
        <div className="users-list">
          <h3>👥 Quản lý Users (Admin Only)</h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className="users-table">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span
                      className={`status ${
                        user.isActive ? "active" : "inactive"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="user-actions">
                    <select
                      value={user.role}
                      onChange={(e) => changeUserRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => toggleUserStatus(user._id, !user.isActive)}
                      className={user.isActive ? "btn-danger" : "btn-success"}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="btn-danger"
                      disabled={user._id === currentUser.id}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Test Accounts */}
      <div className="test-accounts">
        <h3>🧪 Tài khoản test</h3>
        <ul>
          <li>
            <strong>Admin:</strong> admin@example.com / password123
          </li>
          <li>
            <strong>Moderator:</strong> moderator@example.com / password123
          </li>
          <li>
            <strong>User:</strong> user@example.com / password123
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RBACDemo;
