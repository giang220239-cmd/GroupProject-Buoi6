import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra quyền admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || !user.role || user.role !== "admin") {
      setMessage({
        type: "error",
        text: "Bạn không có quyền truy cập trang Admin",
      });
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setCurrentUser(user);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Sử dụng route admin để lấy full user list
      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        setMessage({ type: "error", text: "Phiên đăng nhập đã hết hạn" });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setMessage({ type: "error", text: "Bạn không có quyền truy cập" });
        navigate("/");
      } else {
        setMessage({ type: "error", text: "Lỗi khi tải danh sách users" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Không cho phép xóa chính mình nếu là admin cuối cùng
    if (currentUser && currentUser.id === userId) {
      const adminCount = users.filter((user) => user.role === "admin").length;
      if (adminCount <= 1) {
        setMessage({
          type: "error",
          text: "Không thể xóa admin cuối cùng trong hệ thống",
        });
        return;
      }
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn xóa user "${userName}"?\\n\\nHành động này không thể hoàn tác!`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        setMessage({
          type: "success",
          text:
            response.data.message || `Đã xóa user "${userName}" thành công!`,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Lỗi khi xóa user",
      });
    }
  };

  const handleUpdateRole = async (userId, newRole, userName) => {
    // Không cho phép hạ quyền admin cuối cùng
    if (
      currentUser &&
      currentUser.id === userId &&
      currentUser.role === "admin" &&
      newRole !== "admin"
    ) {
      const adminCount = users.filter((user) => user.role === "admin").length;
      if (adminCount <= 1) {
        setMessage({
          type: "error",
          text: "Không thể hạ quyền admin cuối cùng trong hệ thống",
        });
        return;
      }
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn thay đổi quyền của "${userName}" thành ${newRole}?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        setMessage({
          type: "success",
          text:
            response.data.message ||
            `Đã cập nhật quyền cho "${userName}" thành công!`,
        });

        // Nếu user đang thay đổi quyền chính mình, cập nhật localStorage
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...currentUser, role: newRole };
          setCurrentUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Lỗi khi cập nhật quyền",
      });
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h1>👑 Trang Quản Trị Admin</h1>
          <p className="admin-subtitle">
            Quản lý người dùng và phân quyền hệ thống
          </p>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Tổng Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.filter((u) => u.role === "user").length}
            </div>
            <div className="stat-label">Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.filter((u) => u.isActive).length}
            </div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="role-filter"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">👑 Admin</option>
              <option value="user">👤 User</option>
            </select>
          </div>
          <div className="filter-group">
            <button onClick={fetchUsers} className="btn btn-refresh">
              🔄 Làm mới
            </button>
          </div>
        </div>

        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>Không tìm thấy users</h3>
              <p>Không có user nào khớp với tiêu chí tìm kiếm</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>👤 Thông tin</th>
                  <th>🎭 Vai trò</th>
                  <th>🟢 Trạng thái</th>
                  <th>🕐 Hoạt động</th>
                  <th>⚙️ Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                          <div className="user-id">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleUpdateRole(user._id, e.target.value, user.name)
                        }
                        className={`role-selector role-${user.role}`}
                        disabled={
                          currentUser &&
                          currentUser.id === user._id &&
                          users.filter((u) => u.role === "admin").length <= 1
                        }
                      >
                        <option value="user">👤 User</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "✅ Hoạt động" : "❌ Vô hiệu"}
                      </span>
                    </td>
                    <td>
                      <div className="activity-info">
                        <div>Đăng nhập: {formatDate(user.lastLogin)}</div>
                        <div>Tạo: {formatDate(user.createdAt)}</div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="btn btn-danger btn-sm"
                          disabled={
                            currentUser &&
                            currentUser.id === user._id &&
                            users.filter((u) => u.role === "admin").length <= 1
                          }
                          title="Xóa user"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default Admin;
