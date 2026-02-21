import React, { useMemo, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { notifications as seedNotifications } from "../../data/mock.js";

function NotificationCenter({ open, onClose, items, markRead }) {
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const filtered = useMemo(() => {
  const base = [...items];

  if (tab === "unread") return base.filter((n) => !n.read);
  if (tab === "pending") return base.filter((n) => n.statusKey === "PENDING");   // ✅ รอรับงาน
  if (tab === "progress") return base.filter((n) => n.statusKey === "PROGRESS"); // ✅ ดำเนินการ
  if (tab === "done") return base.filter((n) => n.statusKey === "DONE");

  return base;
}, [tab, items]);

  if (!open) return null;

  return (
    <div className="nc-overlay" role="dialog" aria-modal="true" aria-label="Notifications Center">
      <div className="nc-modal">
        <div className="nc-head">
          <div>
            <div className="nc-title">ศูนย์การแจ้งเตือน</div>
            <div className="nc-sub">Notifications Center</div>
          </div>

          <button className="nc-close" onClick={onClose} type="button" aria-label="close">
            ×
          </button>
        </div>

        <div className="nc-tabs">
            <button type="button" className={`nc-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
                ทั้งหมด
            </button>

            <button type="button" className={`nc-tab ${tab === "unread" ? "active" : ""}`} onClick={() => setTab("unread")}>
                ยังไม่อ่าน
            </button>

            <button type="button" className={`nc-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
                รอรับงาน
            </button>

            <button type="button" className={`nc-tab ${tab === "progress" ? "active" : ""}`} onClick={() => setTab("progress")}>
                ดำเนินการ
            </button>

            <button type="button" className={`nc-tab ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>
                เสร็จสิ้น
            </button>
            </div>

        <div className="nc-list">
          {filtered.map((n) => (
            <div key={n.id} className={`nc-item ${n.read ? "" : "nc-unread"}`}>
              <div className="nc-row1">
                <span className={`nc-pill ${n.pillTone}`}>{n.pillText}</span>
                <span className="nc-time">{n.timeAgo}</span>
              </div>

              <div className="nc-main">
                <div className="nc-main-title">{n.title}</div>
                <div className="nc-main-desc">{n.desc}</div>

                {/* ✅ กดอ่าน -> markRead แล้วค่อยปิด modal */}
                <Link
                  to={`/requests/${n.requestId}`}
                  className="nc-link"
                  onClick={() => {
                    markRead(n.id);
                    onClose?.();
                  }}
                >
                  ดูรายละเอียดคำขอ →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="nc-more">
          โหลดการแจ้งเตือนเพิ่มเติม
        </button>
      </div>

      <button className="nc-backdrop" onClick={onClose} aria-label="close backdrop" type="button" />
    </div>
  );
}

export default function Layout() {
  const [ncOpen, setNcOpen] = useState(false);

  // ✅ ทำให้แจ้งเตือนเป็น state เพื่ออัปเดต read ได้
  const [notifs, setNotifs] = useState(seedNotifications);

  const markRead = (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="app">
      <Navbar />

      <Outlet />

      <Footer />

      <NotificationCenter
        open={ncOpen}
        onClose={() => setNcOpen(false)}
        items={notifs}
        markRead={markRead}
      />
    </div>
  );
}
