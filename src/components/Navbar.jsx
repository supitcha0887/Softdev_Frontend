import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import svg from "../assets/svg.png";
import user from "../assets/user.png";

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar({ setNcOpen, notifs }) {
  const { pathname } = useLocation();
  const isList = pathname.startsWith("/requests");

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link to="/" className="brand">
          <div className="brand-badge">
              <img src={svg} alt="Repair Logo" />
          </div>
          <div className="brand-text">
            <div className="brand-title">ระบบแจ้งซ่อม</div>
            <div className="brand-sub">Repair System</div>
          </div>
        </Link>
      </div>

      <div className="topbar-right">
        <nav className="crumbs" aria-label="breadcrumb">
              <Link to="/" className={`crumb-link ${!isList ? "active" : ""}`}>หน้าแรก / Home</Link>
              <Link to="/requests" className={`crumb-link ${isList ? "active" : ""}`}>รายการแจ้งซ่อม / List</Link>
              </nav>

        {/* ✅ Bell + numeric badge */}
        <button
          className="icon-btn bell-btn"
          aria-label="notifications"
          type="button"
          onClick={() => setNcOpen(true)}
        >
          <IconBell />

          {/* ✅ แสดงเป็นตัวเลขเมื่อมี unread และซ่อนเมื่อ 0 */}
          {unreadCount > 0 && (
            <span className="bell-badge" aria-label={`${unreadCount} unread`}>
              {badgeText}
            </span>
          )}
        </button>

        <div className="user-chip">
              <img className="user-icon" src={user} alt="status" />
          <span>STAFF-0024</span>
      </div>
      </div>
    </header>
  );
}
