import React, { useMemo, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./NotificationCenter.module.css";
import { supabase } from "../supabaseClient";

/* -------------------------
   Helpers
-------------------------- */
function timeAgo(dateLike) {
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hrs / 24);
  return `${days} วันที่แล้ว`;
}

function toneFromNotifType(type) {
  const t = String(type || "").toUpperCase().trim();

  if (t === "NEW_REPORT" || t === "REPORT_CREATED") return "pending";
  if (t === "INFO") return "accepted";
  if (t === "COMPLETION") return "completed";
  if (t === "ADMIN_SUMMARY") return "in_progress";

  const lower = t.toLowerCase();
  if (
    lower === "pending" ||
    lower === "accepted" ||
    lower === "in_progress" ||
    lower === "completed"
  ) {
    return lower;
  }

  return "muted";
}

function pillTextFromType(type) {
  const t = String(type || "").toUpperCase().trim();

  if (t === "NEW_REPORT") return "คำร้องใหม่";
  if (t === "REPORT_CREATED") return "ส่งคำร้องสำเร็จ";
  if (t === "COMPLETION") return "งานเสร็จสิ้น";
  if (t === "ADMIN_SUMMARY") return "สรุปจากผู้ดูแล";
  if (t === "INFO") return "ข้อมูล";

  return "การแจ้งเตือน";
}

function mapNotifToUi(n) {
  const createdAt = n.create_at ?? n.created_at ?? n.createdAt ?? null;
  const tone = toneFromNotifType(n.type);

  return {
    id: n.id,
    title: n.title,
    desc: n.desc,
    read: !!n.is_read,
    requestId: n.related_report_id,
    statusKey: tone,
    pillTone: tone,
    pillText: pillTextFromType(n.type),
    timeAgo: timeAgo(createdAt),
    _createdAt: createdAt,
  };
}

/* -------------------------
   Notification Center
-------------------------- */
function NotificationCenter({ open, onClose, items, markRead }) {
  const [tab, setTab] = useState("all");
  const [mode, setMode] = useState("modal"); // "modal" | "fullscreen"
  const [pageSize, setPageSize] = useState(12);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // reset when open
  useEffect(() => {
    if (!open) return;
    setTab("all");
    setMode("modal");
    setPageSize(12);
  }, [open]);

  const filtered = useMemo(() => {
    const base = Array.isArray(items) ? [...items] : [];
    if (tab === "unread") return base.filter((n) => !n.read);
    if (tab === "pending") return base.filter((n) => n.statusKey === "pending");
    if (tab === "accepted") return base.filter((n) => n.statusKey === "accepted");
    if (tab === "progress") return base.filter((n) => n.statusKey === "in_progress");
    if (tab === "done") return base.filter((n) => n.statusKey === "completed");
    return base;
  }, [tab, items]);

  const visible = useMemo(() => {
    // modal: โชว์สั้น ๆ
    if (mode === "modal") return filtered.slice(0, 10);
    // fullscreen: โชว์ตาม pageSize
    return filtered.slice(0, pageSize);
  }, [filtered, mode, pageSize]);

  if (!open) return null;

  const isFullscreen = mode === "fullscreen";

  return (
    <div className={`nc-overlay ${isFullscreen ? "nc-fullscreen" : ""}`} role="dialog" aria-modal="true">
      <div className={`nc-modal ${isFullscreen ? "nc-modal-full" : ""}`}>
        <div className="nc-head">
          <div>
            <div className="nc-title">
              {isFullscreen ? "การแจ้งเตือนทั้งหมด" : "ศูนย์การแจ้งเตือน"}
            </div>
            <div className="nc-sub">Notifications Center</div>
          </div>

          <div className="nc-head-actions">
            {isFullscreen && (
              <button
                className={styles.closeBtn}
                type="button"
                onClick={onClose}
                aria-label="minimize"
              >
                x
              </button>
            )}
          </div>
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
          <button type="button" className={`nc-tab ${tab === "accepted" ? "active" : ""}`} onClick={() => setTab("accepted")}>
            รับงานแล้ว
          </button>
          <button type="button" className={`nc-tab ${tab === "progress" ? "active" : ""}`} onClick={() => setTab("progress")}>
            ดำเนินการ
          </button>
          <button type="button" className={`nc-tab ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>
            เสร็จสิ้น
          </button>
        </div>

        <div className="nc-list">
          {visible.map((n) => (
            <div key={n.id} className={`nc-item ${n.read ? "" : "nc-unread"}`}>
              <div className="nc-row1">
                <span className={`nc-pill ${n.pillTone}`}>{n.pillText}</span>
                <span className="nc-time">{n.timeAgo}</span>
              </div>

              <div className="nc-main">
                <div className="nc-main-title">{n.title}</div>
                <div className="nc-main-desc">{n.desc}</div>

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

          {visible.length === 0 && (
            <div style={{ padding: "18px 0", color: "#64748b" }}>
              ไม่มีการแจ้งเตือนในหมวดนี้
            </div>
          )}
        </div>

        <div className="nc-footer">
          {!isFullscreen ? (
            <button type="button" className="nc-more" onClick={() => setMode("fullscreen")}>
              โหลดการแจ้งเตือนเพิ่มเติม
            </button>
          ) : (
            <button
              type="button"
              className="nc-more"
              onClick={() => setPageSize((s) => s + 12)}
              disabled={pageSize >= filtered.length}
            >
              {pageSize >= filtered.length ? "ไม่มีรายการเพิ่มแล้ว" : "โหลดเพิ่ม"}
            </button>
          )}
        </div>
      </div>

      {/* backdrop: fullscreen จะยังคลิกปิดได้ (ถ้าไม่อยากให้คลิกปิด เอาออกได้) */}
      <button className="nc-backdrop" onClick={onClose} aria-label="close backdrop" type="button" />
    </div>
  );
}

/* -------------------------
   Layout
-------------------------- */
export default function Layout() {
  const [ncOpen, setNcOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifs([]);
      setUnreadCount(0);
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/MyNotifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setNotifs([]);
      return;
    }

    const data = await res.json();
    const mapped = (Array.isArray(data) ? data : []).map(mapNotifToUi);

    mapped.sort((a,b)=> new Date(b._createdAt||0)-new Date(a._createdAt||0));

    setNotifs(mapped);

    const localUnread = mapped.reduce((acc,n)=> acc+(n.read?0:1),0);
    setUnreadCount(localUnread);
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/UnreadCount`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();
    const count = typeof data==="number"?data:Number(data?.count ?? data?.unread ?? data?.unreadCount);

    if(Number.isFinite(count)) setUnreadCount(count);
  };

  const markRead = async(id)=>{
    const token = localStorage.getItem("token");

    setNotifs(prev=> prev.map(n=> n.id===id?{...n,read:true}:n));
    setUnreadCount(c=> Math.max(0,c-1));

    if(!token) return;

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/MarkAsRead/${id}`,{
      method:"PUT",
      headers:{Authorization:`Bearer ${token}`}
    });
  };

  useEffect(()=>{
    fetchNotifications();
    fetchUnreadCount();
  },[]);

  useEffect(()=>{
    if(!ncOpen) return;
    fetchNotifications();
    fetchUnreadCount();
  },[ncOpen]);

  useEffect(()=>{
    let channel;
    let alive=true;

    const setup = async()=>{
      const {data}=await supabase.auth.getUser();
      const user=data?.user;
      if(!user) return;

      channel=supabase
        .channel(`notifications:${user.id}`)
        .on("postgres_changes",
        {event:"*",schema:"public",table:"notifications",filter:`user_id=eq.${user.id}`},
        (payload)=>{
          if(!alive) return;

          if(payload.eventType==="INSERT"){
            const ui=mapNotifToUi(payload.new);
            setNotifs(prev=> prev.some(x=>x.id===ui.id)?prev:[ui,...prev]);
            if(!payload.new.is_read) setUnreadCount(c=>c+1);
          }

          if(payload.eventType==="UPDATE"){
            const ui=mapNotifToUi(payload.new);
            const wasRead=!!payload.old?.is_read;
            const isRead=!!payload.new?.is_read;

            setNotifs(prev=> prev.map(x=> x.id===ui.id?ui:x));

            if(!wasRead && isRead) setUnreadCount(c=>Math.max(0,c-1));
            if(wasRead && !isRead) setUnreadCount(c=>c+1);
          }

          if(payload.eventType==="DELETE"){
            const id=payload.old?.id;
            const wasUnread=payload.old && !payload.old.is_read;

            setNotifs(prev=> prev.filter(x=>x.id!==id));
            if(wasUnread) setUnreadCount(c=>Math.max(0,c-1));
          }
        }).subscribe();
    };

    setup();

    return ()=>{
      alive=false;
      if(channel) supabase.removeChannel(channel);
    };
  },[]);

  return (
    <div className="app">
      <Navbar setNcOpen={setNcOpen} unreadCount={unreadCount} />

      <Outlet />

      <Footer />

      <NotificationCenter
        open={ncOpen}
        onClose={()=>setNcOpen(false)}
        items={notifs}
        markRead={markRead}
      />
    </div>
  );
}