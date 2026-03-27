import React from "react";

const SearchBar = ({ searchTerm, onSearchChange, totalUsers }) => {
  return (
    <div className="search-container">
      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm user theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => onSearchChange("")}
            title="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-results-info">
          Tìm thấy {totalUsers} kết quả cho "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
