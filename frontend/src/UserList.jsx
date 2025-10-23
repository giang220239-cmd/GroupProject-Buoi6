import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddUser from "./AddUser";
import SearchBar from "./SearchBar";

const UserList = ({
  users = [],
  onUsersChange,
  refreshUsers,
  usersError = null,
}) => {
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Xóa user
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUsers = users.filter((u) => u._id !== id);
      if (onUsersChange) {
        onUsersChange(updatedUsers);
      }
      setMessage({
        type: "success",
        text: `✅ Đã xóa user "${name}" thành công!`,
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      setMessage({ type: "error", text: "❌ Có lỗi xảy ra khi xóa user" });
    }
  };

  // Bấm nút sửa -> hiện form
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email });
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "" });
  };

  // Submit form cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Tên không được để trống" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Email không hợp lệ" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/users/${editingUser}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUser(null);
      setFormData({ name: "", email: "" });
      setMessage({
        type: "success",
        text: "✅ Cập nhật thông tin user thành công!",
      });
      if (refreshUsers) {
        refreshUsers(); // reload danh sách sau khi update
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Lỗi khi cập nhật user:", err);
      setMessage({ type: "error", text: "❌ Có lỗi xảy ra khi cập nhật user" });
    }
  };

  return (
    <>
      {/* Form thêm user */}
      <AddUser onUserAdded={refreshUsers} />

      {/* Danh sách user */}
      <div className="users-container">
        <div className="card-header">
          <h2 className="card-title">👥 Danh Sách Users ({users.length})</h2>
        </div>

        {/* Search bar */}
        {users.length > 0 && (
          <div style={{ padding: "1rem" }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalUsers={filteredUsers.length}
            />
          </div>
        )}

        <div className="card-body" style={{ padding: 0 }}>
          {message && (
            <div style={{ padding: "1rem" }}>
              <div
                className={`alert ${
                  message.type === "success" ? "alert-success" : "alert-error"
                }`}
              >
                {message.text}
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Đang tải danh sách users...
            </div>
          ) : usersError ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3 className="empty-state-title">
                Không thể tải danh sách users
              </h3>
              <p className="empty-state-message">
                Lỗi: {usersError.message || JSON.stringify(usersError)}
              </p>
              <p className="empty-state-message">
                Có thể bạn chưa đăng nhập hoặc không có quyền xem danh sách. Hãy
                đăng nhập bằng tài khoản admin.
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3 className="empty-state-title">Chưa có user nào</h3>
              <p className="empty-state-message">
                Hãy thêm user đầu tiên bằng cách sử dụng form bên trái
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">Không tìm thấy kết quả</h3>
              <p className="empty-state-message">
                Không có user nào khớp với từ khóa "{searchTerm}"
              </p>
            </div>
          ) : (
            <ul className="users-list">
              {filteredUsers.map((user) => (
                <li key={user._id} className="user-item">
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>

                  <div className="user-actions">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(user)}
                      title="Sửa thông tin user"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user._id, user.name)}
                      title="Xóa user"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal form sửa user */}
      {editingUser && (
        <div className="edit-form-overlay" onClick={handleCancelEdit}>
          <div
            className="edit-form-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-form-header">
              <h3 className="edit-form-title">✏️ Chỉnh Sửa Thông Tin User</h3>
            </div>

            <div className="edit-form-body">
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">
                    👤 Họ và Tên
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-email">
                    📧 Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCancelEdit}
                  >
                    ❌ Hủy
                  </button>
                  <button type="submit" className="btn btn-success">
                    ✅ Cập Nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(UserList);
