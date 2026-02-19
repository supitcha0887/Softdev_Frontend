import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Pill } from "../components/UI.jsx";
import { requests, STATUS, statusTone } from "../data/mock.js";
import inprogress from "../assets/inprogress.png";
import complete from "../assets/complete.png";

export default function RequestDetail() {
  const { id } = useParams();

  const req = useMemo(() => requests.find((r) => r.id === id), [id]);
  const [currentStatus, setCurrentStatus] = useState(req?.status ?? STATUS.PENDING);
  const [assigned, setAssigned] = useState(req?.assigned ?? "Unassigned");

  if (!req) {
    return (
      <main className="container">
        <Card>
          <div className="detail-head">
            <div>
              <div className="detail-title">ไม่พบคำร้อง</div>
              <div className="muted">Request not found</div>
            </div>
            <Link className="btn-light" to="/requests">กลับ</Link>
          </div>
        </Card>
      </main>
    );
  }

  const acceptJob = () => {
    setAssigned("STAFF-0024");
    if (currentStatus === STATUS.NEW) setCurrentStatus(STATUS.PENDING);
  };

  const cancelJob = () => setCurrentStatus(STATUS.CANCELED);

  const steps = [
    { key: "submitted", labelTH: "ส่งคำร้อง", labelEN: "Submitted", on: true, tone: "ok" },
    { key: "accepted", labelTH: "รับงาน", labelEN: "Accepted", on: assigned !== "Unassigned", tone: "warn" },
    { key: "progress", labelTH: "ดำเนินการ", labelEN: "In Progress", on: currentStatus === STATUS.PROGRESS || currentStatus === STATUS.DONE, tone: "progress" },
    { key: "done", labelTH: "เสร็จสิ้น", labelEN: "Completed", on: currentStatus === STATUS.DONE, tone: "ok" },
  ];

  return (
    <main className="container detail-page">
      <div className="detail-topbar">
        <div>
          <div className="detail-title">รายละเอียดคำร้อง / Request Detail</div>
          <div className="muted">คำร้องซ่อมแซมหมายเลข {req.id}</div>
        </div>

        <Link to="/requests" className="back-link">
          ← กลับ Back
        </Link>
      </div>

      <div className="detail-grid">
        <Card className="detail-main">
          <div className="section-title">รูปภาพปัญหา / Problem Images</div>
          <div className="detail-img">
            <img src={req.img} alt={req.titleEN} />
          </div>
        </Card>

        <div className="detail-side">
          <Card>
            <div className="section-title">การดำเนินการ / Actions</div>
            <button className="btn-danger" type="button" onClick={acceptJob}>
              รับงานซ่อม Accept Job
            </button>
            <button className="btn-warn" type="button" onClick={cancelJob}>
              ยกเลิกงานซ่อม Cancel Job
            </button>
          </Card>

          <Card>
            <div className="section-title">สถานะปัจจุบัน / Current Status</div>
            <div className="kv">
              <div className="muted">สถานะ / Status</div>
              <Pill tone={statusTone(currentStatus)}>{currentStatus}</Pill>
            </div>
            <div className="kv">
              <div className="muted">ผู้รับผิดชอบ / Assigned</div>
              <div className="kv-val">{assigned}</div>
            </div>

            <div style={{ marginTop: 10 }}>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                aria-label="change status"
                style={{ width: "100%" }}
              >
                <option value={STATUS.NEW}>{STATUS.NEW}</option>
                <option value={STATUS.PENDING}>{STATUS.PENDING}</option>
                <option value={STATUS.PROGRESS}>{STATUS.PROGRESS}</option>
                <option value={STATUS.DONE}>{STATUS.DONE}</option>
                <option value={STATUS.CANCELED}>{STATUS.CANCELED}</option>
              </select>
            </div>
          </Card>
        </div>

        <Card className="detail-wide">
          <div className="section-title">ข้อมูลคำร้อง / Request Information</div>

          <div className="info-grid">
            <div className="info-block">
              <div className="info-k">ชื่อเรื่อง / Title</div>
              <div className="info-v">{req.titleTH} / {req.titleEN}</div>
            </div>

            <div className="info-block">
              <div className="info-k">ประเภทปัญหา / Problem Type</div>
              <div className="info-v">{req.typeTH}</div>
            </div>

            <div className="info-block">
              <div className="info-k">สถานที่ / Location</div>
              <div className="info-v">{req.locationTH}<div className="muted">{req.locationEN}</div></div>
            </div>

            <div className="info-block">
              <div className="info-k">หมายเลขครุภัณฑ์ / Asset Number</div>
              <div className="info-v">{req.assetNo}</div>
            </div>

            <div className="info-block">
              <div className="info-k">ผู้แจ้ง / Reporter</div>
              <div className="info-v">{req.reporter}<div className="muted">Tel: {req.tel}</div></div>
            </div>

            <div className="info-block">
              <div className="info-k">วันรับแจ้ง / Submitted Date</div>
              <div className="info-v">{req.dateTH}<div className="muted">{req.dateEN}</div></div>
            </div>
          </div>
        </Card>

        <Card className="detail-wide">
  <div className="section-title">สถานะคำร้อง / Status Timeline</div>

  <div className="statusbar">
                {steps.map((s, idx) => (
                <div key={s.key} className="status-step">
                    <div className="status-top">
                    <div className={`status-icon ${s.on ? `is-on tone-${s.tone}` : "is-off"}`}>
                        {s.key === "submitted" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        )}

                        {s.key === "accepted" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2.2" />
                        </svg>
                        )}

                        {s.key === "progress" && (
                        <img src={inprogress} alt="In Progress" className="status-img" />
                        )}

                        {s.key === "done" && (
                        <img src={complete} alt="Completed" className="status-img" />
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
                <div className="act-title">ส่งคำร้องซ่อมแล้ว / Request submitted</div>
                <div className="muted">{req.dateTH} 14:30</div>
              </div>
            </div>

            <div className="act">
              <span className="act-ico act-ico-ok">✓</span>
              <div>
                <div className="act-title">เจ้าหน้าที่ตรวจสอบคำร้อง / Staff reviewed request</div>
                <div className="muted">โดย ST001 • {req.dateTH} 15:45</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
