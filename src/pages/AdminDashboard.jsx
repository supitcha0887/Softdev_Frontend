import React from "react";
import { Link } from "react-router-dom";
import { Card, Pill } from "../components/UI.jsx";
import { requests, stats, statusToneList } from "../data/mock.js";



function StatIcon({ type }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };

  // NEW = bag
  if (type === "NEW") {
    return (
      <svg {...common}>
        <path d="M7 7V6a5 5 0 0 1 10 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 7h12l-1 14H7L6 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  // PENDING = clock
  if (type === "PENDING") {
    return (
      <svg {...common}>
        <path
          d="M12 8v5l3 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // PROGRESS = gear
  if (type === "PROGRESS") {
    return (
      <svg {...common}>
        <path d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" stroke="currentColor" strokeWidth="2" />
        <path
          d="M19.4 13a7.9 7.9 0 0 0 .05-1 7.9 7.9 0 0 0-.05-1l2.05-1.6-2-3.46-2.5 1a7.6 7.6 0 0 0-1.73-1L15 2h-6l-.22 2.94c-.6.25-1.18.58-1.73 1l-2.5-1-2 3.46L4.6 11a7.9 7.9 0 0 0-.05 1c0 .34.02.67.05 1L2.55 14.6l2 3.46 2.5-1c.55.42 1.13.75 1.73 1L9 22h6l.22-2.94c.6-.25 1.18-.58 1.73-1l2.5 1 2-3.46L19.4 13Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // DONE = check circle
  return (
    <svg {...common}>
      <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <section className="hero hero-dashboard">
        <div className="hero-inner">
          <h1>Admin Dashboard</h1>
          <p className="hero-sub">แดชบอร์ดผู้ดูแลระบบ</p>
          <p className="hero-desc">Track and manage repair requests in ECC building</p>

          <Link className="btn-light" to="/requests">
            ☰ ดูคำขอทั้งหมด / View All Requests
          </Link>
        </div>
      </section>

      <main className="container">
        <div className="stats">
          {stats.map((s) => (
            <Card key={s.pill} className="stat-card">
              <div className="stat-top">
                    <img
                    src={s.icon}
                    className={`stat-icon icon-${s.tone}`}
                    alt={s.pill}
                    />
                    <Pill tone={s.tone}>{s.pill}</Pill>
                    </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">
                {s.labelTH} / {s.labelEN}
              </div>
            </Card>
          ))}

          <Card className="side-card">
            <div className="side-title">ภาระงานวันนี้ / Today's Workload</div>
            <div className="workload">
              <div className="work-row work-blue">
                <div>
                  <div className="work-name">รับผิดชอบวันนี้</div>
                  <div className="work-sub">Accepted by me</div>
                </div>
                <div className="work-num">5</div>
              </div>

              <div className="work-row work-amber">
                <div>
                  <div className="work-name">เหลือวันนี้</div>
                  <div className="work-sub">Remaining today</div>
                </div>
                <div className="work-num">3</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dash-grid">
          <Card className="dash-main">
            <div className="dash-head">
              <div className="dash-title">รายงานการซ่อมใหม่ / New Repair Reports</div>
              <Link to="/requests" className="dash-link">
                ดูทั้งหมด / View All
              </Link>
            </div>

            <div className="list">
              {requests.slice(0, 3).map((r) => (
                <div key={r.id} className="list-item">
                  <img className="thumb" src={r.img} alt={r.titleEN} />
                  <div className="li-body">
                    <div className="li-title">
                      {r.titleTH} / {r.titleEN}
                    </div>
                    <div className="li-sub">
                      {r.locationTH} • Reported by {r.reporter}
                    </div>
                    <div className="li-meta">
                      {r.dateTH} / {r.dateEN}
                    </div>
                  </div>

                  <div className="li-right">
                    {/* ✅ PENDING ใน “รายการซ่อมใหม่” จะเป็นกล่องสีเทา */}
                    <Pill tone={statusToneList(r.status)}>{r.status}</Pill>
                    <Link className="btn-danger-sm" to={`/requests/${r.id}`}>
                      เปิด / Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="dash-side">
            <div className="side-title">อัพเดทล่าสุด / Latest Updates</div>
            <ul className="updates">
              <li><span className="dot dot-ok" /> รับแจ้งซ่อมรายการล่าสุด • 5 นาทีที่แล้ว</li>
              <li><span className="dot dot-blue" /> เปลี่ยนสถานะเป็นกำลังดำเนินการ • 15 นาทีที่แล้ว</li>
              <li><span className="dot dot-amber" /> รายการรอรับงาน • 1 ชั่วโมงที่แล้ว</li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
