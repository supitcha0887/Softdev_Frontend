import React, { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, Pill } from "../../components/UI.jsx";
import {
  reports as mockReports,
  STATUS,
  statusTone,
  STATUS_DISPLAY,
} from "../../../data/mock.js";
import styles from "./RequestDetail.module.css";
import inprogress from "../../assets/inprogress.svg";
import complete from "../../assets/complete.png";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the initial report from mock data
  const initialReport = useMemo(
    () => mockReports.find((r) => r.id === id),
    [id],
  );

  // Use state to hold the report data, allowing for updates
  const [report, setReport] = useState(initialReport);

  if (!report) {
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
  const handleAcceptJob = () => {
    // TODO: API call to update status to 'in_progress'
    setReport({
      ...report,
      status: STATUS.IN_PROGRESS,
      assigned: "STAFF-0024",
    });
  };

  const handleCancelJob = () => {
    // TODO: API call to update status to 'cancelled'
    setReport({ ...report, status: STATUS.CANCELLED, assigned: "Unassigned" });
  };

  const handleUpdateProgress = () => {
    navigate(`/requests/${report.id}/update-progress`);
  };

  // --- Conditional Action Buttons ---
  const renderActions = () => {
    switch (report.status) {
      case STATUS.PENDING:
        return (
          <div className={styles.actionBox}>
            <button
              type="button"
              onClick={handleAcceptJob}
              className={`${styles.actionBtn} ${styles.acceptBtn}`}
            >
              รับงานซ่อม Accept Job
            </button>
            <button
              type="button"
              onClick={handleCancelJob}
              className={`${styles.actionBtn} ${styles.cancelBtn}`}
            >
              ยกเลิกงานซ่อม Cancel Job
            </button>
          </div>
        );
      case STATUS.IN_PROGRESS:
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
      default:
        return <div className="muted">ไม่มีการดำเนินการสำหรับสถานะนี้</div>;
    }
  };

  const steps = [
    {
      key: "submitted",
      labelTH: "ส่งคำร้อง",
      labelEN: "Submitted",
      on: true,
      tone: "ok",
    },
    {
      key: "progress",
      labelTH: "ดำเนินการ",
      labelEN: "In Progress",
      on:
        report.status === STATUS.IN_PROGRESS ||
        report.status === STATUS.COMPLETED,
      tone: "progress",
    },
    {
      key: "done",
      labelTH: "เสร็จสิ้น",
      labelEN: "Completed",
      on: report.status === STATUS.COMPLETED,
      tone: "ok",
    },
  ];

  return (
    <main className="container detail-page">
      <div className="detail-topbar">
        <div>
          <div className="detail-title">รายละเอียดคำร้อง / Request Detail</div>
          <div className="muted">คำร้องซ่อมแซมหมายเลข {report.id}</div>
        </div>

        <Link to="/requests" className="back-link">
          ← กลับ Back
        </Link>
      </div>

      <div className="detail-grid">
        <Card className="detail-main">
          <div className="section-title">รูปภาพปัญหา / Problem Images</div>
          <div className="detail-img">
            <img src={report.img} alt={report.titleEN} />
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
              <Pill tone={statusTone(report.status)}>
                {STATUS_DISPLAY[report.status] || report.status}
              </Pill>
            </div>
            <div className="kv">
              <div className="muted">ผู้รับผิดชอบ / Assigned</div>
              <div className="kv-val">{report.assigned}</div>
            </div>

            {/* <div style={{ marginTop: 10 }}>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                aria-label="change status"
                style={{ width: "100%" }}
              >
                <option value={STATUS.PENDING}>{STATUS.PENDING}</option>
                <option value={STATUS.PROGRESS}>{STATUS.PROGRESS}</option>
                <option value={STATUS.DONE}>{STATUS.DONE}</option>
                <option value={STATUS.CANCELED}>{STATUS.CANCELED}</option>
              </select>
            </div> */}
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
                {report.titleTH} / {report.titleEN}
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">ประเภทปัญหา / Problem Type</div>
              <div className="info-v">{report.typeTH}</div>
            </div>

            <div className="info-block" style={{ gridColumn: "1 / -1" }}>
              <div className="info-k">รายละเอียดอาการ / Description</div>
              <div className="info-v">{report.description || "-"}</div>
            </div>

            <div className="info-block">
              <div className="info-k">สถานที่ / Location</div>
              <div className="info-v">
                {report.locationTH}
                <div className="muted">{report.locationEN}</div>
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">หมายเลขครุภัณฑ์ / Asset Number</div>
              <div className="info-v">{report.assetNo}</div>
            </div>

            <div className="info-block">
              <div className="info-k">ผู้แจ้ง / Reporter</div>
              <div className="info-v">
                {report.reporter}
                <div className="muted">Tel: {report.tel}</div>
              </div>
            </div>

            <div className="info-block">
              <div className="info-k">วันรับแจ้ง / Submitted Date</div>
              <div className="info-v">
                {report.dateTH}
                <div className="muted">{report.dateEN}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="detail-wide">
          <div className="section-title">สถานะคำร้อง / Status Timeline</div>

          <div className="statusbar">
            {steps.map((s, idx) => (
              <div key={s.key} className="status-step">
                <div className="status-top">
                  <div
                    className={`status-icon ${s.on ? `is-on tone-${s.tone}` : "is-off"}`}
                  >
                    {s.key === "submitted" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 6 9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    {s.key === "accepted" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 8v5l3 2"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                      </svg>
                    )}

                    {s.key === "progress" && (
                      <img
                        src={inprogress}
                        alt="In Progress"
                        className="status-img"
                      />
                    )}

                    {s.key === "done" && (
                      <img
                        src={complete}
                        alt="Completed"
                        className="status-img"
                      />
                    )}
                  </div>

                  {idx !== steps.length - 1 && <div className="status-line" />}
                </div>

                <div className="status-label">
                  <div className="status-th">{s.labelTH}</div>
                  <div className="status-en">{s.labelEN}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="detail-wide">
          <div className="section-title">บันทึกกิจกรรม / Activity Log</div>
          <div className="activity">
            <div className="act">
              <span className="act-ico">＋</span>
              <div>
                <div className="act-title">
                  ส่งคำร้องซ่อมแล้ว / Request submitted
                </div>
                <div className="muted">{report.dateTH} 14:30</div>
              </div>
            </div>

            <div className="act">
              <span className="act-ico act-ico-ok">✓</span>
              <div>
                <div className="act-title">
                  เจ้าหน้าที่ตรวจสอบคำร้อง / Staff reviewed request
                </div>
                <div className="muted">โดย ST001 • {report.dateTH} 15:45</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
