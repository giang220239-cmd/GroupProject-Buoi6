import React, { useEffect, useState } from "react";

const Header = React.memo(({ totalUsers }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000); // update mỗi phút
    return () => clearInterval(id);
  }, []);

  const getCurrentTime = () =>
    now.toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <header className="app-header fade-in">
      <div className="header-content">
        <div className="header-main">
          <h1 className="app-title">🏢 Hệ Thống Quản Lý User</h1>
          <p className="app-subtitle">
            Quản lý thông tin người dùng một cách dễ dàng và hiệu quả
          </p>
        </div>

        <div className="header-info">
          <div className="time-info">
            <span className="time-icon">🕒</span>
            <span className="time-text">{getCurrentTime()}</span>
          </div>
          <div className="status-info">
            <span className="status-dot"></span>
            <span className="status-text">Hệ thống hoạt động bình thường</span>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
