import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, Pill } from "../../components/UI.jsx";


import { supabase } from "../../supabaseClient";
import styles from "./RequestDetail.module.css";
import { useNotification } from "../../contexts/NotificationContext";

import pending from "../../assets/pending.svg";
import progress from "../../assets/progress.svg";
import finish from "../../assets/finish.svg";
import accepted from "../../assets/accepted.svg";


export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [AdminData, setAdmin] = useState("");
  const { showToast } = useNotification();

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);

  function statusTone(status) {
    switch (status) {
      case "pending":
        return "pending";

      case "accepted":
        return "accepted";

      case "in_progress":
        return "in_progress";

      case "completed":
        return "completed";

      default:
        return "muted";
    }
  }

      const fetchReports = async () =>{
        const token = localStorage.getItem("token");
        if(!token){
          setError("No authentication token found.");
          setLoading(false);
          return;
        }
        setLoading(true);
        setError(null);
        
  
        try{
          const reportsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/AdminManage/repair-requests/${id}`,{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
          });
          
          if (!reportsResponse.ok) {
            if (reportsResponse.status === 401) {
              localStorage.removeItem("token");
              window.location.href = "/";
              return;
            }
            throw new Error(`HTTP error! status: ${reportsResponse.status}`);
          }
          const allReports = await reportsResponse.json();
          setReports(allReports);
        }catch(err){
          setError(err.message || "Failed to fetch reports check the API.");
        }finally{
          setLoading(false);
        }
      };

    useEffect(() => {
      const token = localStorage.getItem("token");
      const fetchUserData = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
  
        if (userError || !user) {
          setAdmin("");
          setUnreadCount(0);
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        try {
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("full_name, user_id")
            .eq("user_id", user.id)
            .single();
  
          if (profileError) throw profileError;
          setAdmin({
            id: profile.user_id,
            name: profile.full_name
          })
  
        } catch (error) {
          setAdmin("");
        }
      };

      fetchUserData();
      fetchReports();

  
  }, []);



  if (!reports) {
    return (
      <main className="container">
        <Card>
          <div className="detail-head">
            <div>
              <div className="detail-title">ไม่พบคำร้อง</div>
              <div className="muted">Request not found</div>
            </div>
            <Link className="btn-light" to="/requests">
              กลับ
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  // --- Action Handlers ---
  const handleAcceptJob = async () => {
    const token = localStorage.getItem("token");
    try{
      const acceptjob = await fetch(`${import.meta.env.VITE_API_BASE_URL}/AdminManage/repair-requests/${reports.id}/accept`,{
        method:"PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
      }
      });

      if(acceptjob.ok){
        showToast("รับงานเรียบร้อย!", "success");
        fetchReports();
      }else if (acceptjob.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      } else {
        showToast("เกิดข้อผิดพลาดในการรับงาน", "error");
      }     
    }catch(error){
      showToast("Connecting Error.", "error")
    }
  }

  const handleCancelJob = async () => {
    const token = localStorage.getItem("token");
    try{
      const cancelJob = await fetch(`${import.meta.env.VITE_API_BASE_URL}/AdminManage/repair-requests/${reports.id}/cancel`,{
        method:"PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ Reason: "เจ้าหน้าที่ยกเลิกการรับงาน" })
      });

      if(cancelJob.ok){
        showToast("ยกเลิกงานที่รับมอบหมายเรียบร้อย!", "warning");
        fetchReports();
      }else if (cancelJob.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      } else {
      showToast("เกิดข้อผิดพลาดในการยกเลิกงาน", "error");
      }     
    }catch(error){
      showToast("Connecting Error.", "error")
    }
  };

  const handleUpdateProgress = () => {
    navigate(`/requests/${reports.id}/update-progress`);
  };

  // --- Conditional Action Buttons ---
  const renderActions = () => {
    const isOwner = reports?.assigned === AdminData?.name;
    switch (reports?.status?.toLowerCase()) {
      case "pending":
        return (
          <div className={styles.actionBox}>
            <button
              type="button"
              onClick={handleAcceptJob}
              className={`${styles.actionBtn} ${styles.acceptBtn}`}
>
              รับงานซ่อม Accept Job
            </button>
          </div>
        );
      case "accepted":
          if (isOwner) {
            return (
              <div className={styles.actionBox}>
                <button type="button" onClick={handleUpdateProgress} className={`${styles.actionBtn} ${styles.updateBtn}`}>
                  อัพเดทความคืบหน้างาน Update Progress
                </button>
                <button type="button" onClick={handleCancelJob} className={`${styles.actionBtn} ${styles.cancelBtn}`}>
                  ยกเลิกงานซ่อม Cancel Job
                </button>
              </div>
            );
          }
          return <button type="disable" className={`${styles.blockBtn}`}>🔒 งานนี้ถูกรับโดยเจ้าหน้าที่ท่านอื่น.</button>;
      case "in_progress":
        if (isOwner) {
          return (
            <div className={styles.actionBox}>
              <button
                type="button"
                onClick={handleUpdateProgress}
                className={`${styles.actionBtn} ${styles.updateBtn}`}
              >
                อัพเดทความคืบหน้างาน Update Progress
              </button>
            </div>
          );
        }
        return (
          <button
            type="button"
            className={styles.blockBtn}
            disabled
          >
            🔒 งานนี้ถูกรับโดยเจ้าหน้าที่ท่านอื่น
          </button>
        );
      default:
        return <button type="disable" className={`${styles.blockBtn}`}>ไม่มีการดำเนินการสำหรับสถานะนี้</button>;
    }
  };

const getStatusConfig = (key, currentStatus) => {
  const statusOrder = ["pending", "accepted", "in_progress", "completed"];

  const normalizedKey =
    key === "new"
      ? "pending"
      : key === "progress"
      ? "in_progress"
      : key === "done"
      ? "completed"
      : key;

  const currentIndex = statusOrder.indexOf((currentStatus || "").toLowerCase());
  const stepIndex = statusOrder.indexOf(normalizedKey);

  const isDone = stepIndex < currentIndex;
  const isCurrent = stepIndex === currentIndex;
  const isUpcoming = stepIndex > currentIndex;

  switch (key) {
    case "new":
      return {
        labelTH: "รอรับงาน",
        labelEN: "Pending",
        tone: "pending",
        isDone,
        isCurrent,
        isUpcoming,
        icon: <img src={pending} alt="Pending" className="status-img" />
      };

    case "accepted":
      return {
        labelTH: "รับงานแล้ว",
        labelEN: "Accepted",
        tone: "accepted",
        isDone,
        isCurrent,
        isUpcoming,
        icon: <img src={accepted} alt="Accepted" className="status-img" />
      };

    case "progress":
      return {
        labelTH: "กำลังดำเนินการ",
        labelEN: "In Progress",
        tone: "in_progress",
        isDone,
        isCurrent,
        isUpcoming,
        icon: <img src={progress} alt="Progress" className="status-img" />
      };

    case "done":
      return {
        labelTH: "เสร็จสิ้น",
        labelEN: "Completed",
        tone: "completed",
        isDone,
        isCurrent,
        isUpcoming,
        icon: <img src={finish} alt="Completed" className="status-img" />
      };

    default:
      return {};
  }
};

const getLogConfig = (status) => {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return {
        icon: <img src={pending} alt="Pending" className="act-status-img" />,
        className: "act-ico-pending"
      };

    case "ACCEPTED":
      return {
        icon: <img src={accepted} alt="Accepted" className="act-status-img" />,
        className: "act-ico-accepted"
      };

    case "IN_PROGRESS":
      return {
        icon: <img src={progress} alt="In Progress" className="act-status-img" />,
        className: "act-ico-progress"
      };

    case "COMPLETED":
      return {
        icon: <img src={finish} alt="Completed" className="act-status-img" />,
        className: "act-ico-completed"
      };

    default:
      return {
        icon: <span className="act-dot" />,
        className: "act-ico-muted"
      };
  }
};

  return (
    <main className="container detail-page">
      <div className="detail-topbar">
        <div>
          <div className="detail-title">รายละเอียดคำร้อง / Request Detail</div>
          <div className="muted">ชื่อคำร้องซ่อมแซม: {reports.title}</div>
        </div>

        <Link to="/requests" className="back-link">
          ← กลับ Back
        </Link>
      </div>

      <div className="detail-grid">
        <Card className="detail-main">
          <div className="section-title">รูปภาพปัญหา / Problem Images</div>
          <div className="detail-img">
            <img src={reports.img} alt={reports.title} />
          </div>
        </Card>

        <div className="detail-side">
          <Card>
            <div className="section-title">การดำเนินการ / Actions</div>
            {renderActions()}
          </Card>

          <Card>
            <div className="section-title">สถานะปัจจุบัน / Current Status</div>
            <div className="kv">
              <div className="muted">สถานะ / Status</div>
              <Pill tone={statusTone(reports.status)}>
                {reports.status?.toUpperCase()}
              </Pill>
            </div>
            <div className="kv">
              <div className="muted">ผู้รับผิดชอบ / Assigned</div>
              <div className="kv-val">{reports.assigned}</div>
            </div>
          </Card>
        </div>

        <Card className="detail-wide">
          <div className="section-title">
            ข้อมูลคำร้อง / Request Information
          </div>

          <div className="info-grid">
            <div className="info-block">
              <div className="info-k">ชื่อเรื่อง / Title</div>
              <div className="info-v">
                {reports.title}
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">ประเภทปัญหา / Problem Type</div>
              <div className="info-v">{reports.assetType}</div>
            </div>

            <div className="info-block" style={{ gridColumn: "1 / -1" }}>
              <div className="info-k">รายละเอียดอาการ / Description</div>
              <div className="info-v">{reports.description || "-"}</div>
            </div>

            <div className="info-block">
              <div className="info-k">สถานที่ / Location</div>
              <div className="info-v">
                {reports.location}
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">หมายเลขครุภัณฑ์ / Asset Number</div>
              <div className="info-v">{reports.assetNo}</div>
            </div>

            <div className="info-block">
              <div className="info-k">ผู้แจ้ง / Reporter</div>
              <div className="info-v">
                {reports.reporter}
                <div className="muted">Tel: {reports.tel}</div>
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">วันรับแจ้ง / Submitted Date</div>
              <div className="info-v">
                {reports.date}
              </div>
            </div>
          </div>
        </Card>

        <Card className="detail-wide">
  <div className="section-title">สถานะคำร้อง / Status Timeline</div>
  <div className="statusbar">
    {["new", "accepted", "progress", "done"].map((key, idx, arr) => {
      const config = getStatusConfig(key, reports.status);

      const iconStateClass = config.isCurrent
        ? `is-current tone-${config.tone}`
        : config.isDone
        ? `is-done tone-${config.tone}`
        : "is-upcoming";

      const lineStateClass =
        idx < arr.length - 1
          ? config.isDone || config.isCurrent
            ? `line-active line-${config.tone}`
            : "line-upcoming"
          : "";

      return (
        <div key={key} className="status-step">
          <div className="status-top">
            <div className={`status-icon ${iconStateClass}`}>
              {config.icon}
            </div>

            {idx !== arr.length - 1 && (
              <div className={`status-line ${lineStateClass}`} />
            )}
          </div>

          <div className="status-label">
            <div className={`status-th ${config.isCurrent ? "is-current-text" : ""}`}>
              {config.labelTH}
            </div>
            <div className="status-en">{config.labelEN}</div>
          </div>
        </div>
      );
    })}
  </div>
</Card>

        <Card className="detail-wide">
          <div className="section-title">บันทึกกิจกรรม / Activity Log</div>
          <div className="activity">
            {/* 2. Loop ข้อมูลจาก history array */}
            {(Array.isArray(reports.history) ? (showAllLogs ? reports.history : reports.history.slice(0, 4)) : []).map((log, index) => {
              const config = getLogConfig(log.status);
              return (
                <div className="act" key={index}>
                  <span className={`act-ico ${config.className}`}>{config.icon}</span>
                  <div>
                    <div className="act-title">
                      {log.note || log.status} 
                      {log.updated_by && ` • โดย ${log.updated_by}`}
                    </div>
                    <div className="muted">
                      By: {log.by} at: {log.timestamp ? new Date(log.timestamp).toLocaleString("th-TH") : reports.date}
                    </div>
                  </div>
                </div>
              );
            })}

            {Array.isArray(reports.history) && reports.history.length > 4 && (
              <button 
                className="btn-link" 
                onClick={() => setShowAllLogs(!showAllLogs)}
                style={{ margin: '10px 40px', cursor: 'pointer', color: '#ef4444', border: 'none', background: 'none' }}
              >
                {showAllLogs ? "แสดงน้อยลง" : `แสดงเพิ่มเติม (${reports.history.length - 4})`}
              </button>
            )}

            {/* กรณีไม่มีประวัติเพิ่มเติม */}
            {(!reports.history || reports.history.length === 0) && (
              <div className="muted" style={{ padding: '10px 40px' }}>
                ยังไม่มีการอัปเดตสถานะเพิ่มเติม
              </div>
            )}
          </div>
        </Card>

        {reports.status === 'completed' && reports.image_after_url && (
          <Card className="detail-wide">
            <div className="section-title">รูปภาพหลังการซ่อม / After Repair Photo</div>
            <div className="detail-img">
              <img 
                src={reports.image_after_url} 
                alt="After Repair" 
              />
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
