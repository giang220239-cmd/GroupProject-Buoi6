import React, { useState, useRef } from "react";
import "./AvatarUpload.css";

const AvatarUpload = ({ user, onAvatarUpdate, authToken }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    // Validate file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB
      alert("File quá lớn! Vui lòng chọn file nhỏ hơn 20MB.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(
        "http://localhost:8080/api/advanced/upload-avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update user data in parent component
        onAvatarUpdate(data.data.user);
        setPreviewUrl(null);
        alert("Upload avatar thành công!");
      } else {
        alert(data.message || "Upload thất bại!");
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      alert("Không thể upload avatar. Vui lòng thử lại!");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa avatar?")) return;

    setDeleting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/advanced/delete-avatar",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update user data in parent component
        onAvatarUpdate(data.data.user);
        alert("Xóa avatar thành công!");
      } else {
        alert(data.message || "Xóa avatar thất bại!");
      }
    } catch (error) {
      console.error("Delete avatar error:", error);
      alert("Không thể xóa avatar. Vui lòng thử lại!");
    } finally {
      setDeleting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getDisplayAvatar = () => {
    if (previewUrl) return previewUrl;
    if (user?.avatar?.url) return user.avatar.url;
    return null;
  };

  const hasAvatar = user?.avatar?.url && user.avatar.url.trim() !== "";

  return (
    <div className="avatar-upload">
      <div className="avatar-section">
        <h3>🖼️ Ảnh Đại Diện</h3>

        <div className="avatar-container">
          <div className="current-avatar">
            {getDisplayAvatar() ? (
              <img
                src={getDisplayAvatar()}
                alt="Avatar"
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <span className="placeholder-icon">👤</span>
                <p>Chưa có avatar</p>
              </div>
            )}

            {previewUrl && (
              <div className="preview-overlay">
                <span>🔄 Đang upload...</span>
              </div>
            )}

            {uploading && (
              <div className="upload-overlay">
                <div className="upload-spinner">⏳</div>
                <p>Đang upload...</p>
              </div>
            )}
          </div>

          <div
            className={`upload-area ${dragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="upload-content">
              <span className="upload-icon">📤</span>
              <p>
                <strong>Kéo thả</strong> ảnh vào đây hoặc{" "}
                <strong>click để chọn</strong>
              </p>
              <small>Hỗ trợ: JPG, PNG, GIF, WEBP (Max: 20MB)</small>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="avatar-actions">
          <button
            className="upload-btn"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Đang upload...
              </>
            ) : (
              <>
                <span>📷</span>
                Chọn ảnh mới
              </>
            )}
          </button>

          {hasAvatar && (
            <button
              className="delete-btn"
              onClick={handleDeleteAvatar}
              disabled={deleting || uploading}
            >
              {deleting ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  Đang xóa...
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  Xóa avatar
                </>
              )}
            </button>
          )}
        </div>

        <div className="avatar-info">
          <h4>💡 Lưu ý:</h4>
          <ul>
            <li>✓ Kích thước tối đa: 20MB</li>
            <li>✓ Định dạng hỗ trợ: JPG, PNG, GIF, WEBP</li>
            <li>✓ Ảnh sẽ được tự động resize về 400x400px</li>
            <li>✓ Khuyến nghị sử dụng ảnh vuông để có kết quả tốt nhất</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
