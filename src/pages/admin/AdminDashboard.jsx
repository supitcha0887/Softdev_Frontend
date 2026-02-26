import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Pill } from "../../components/UI.jsx";
import { reports, stats, statusToneList, STATUS } from "../../../data/mock.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export default function AdminDashboard() {
  // Logic for Reports by Location
  const locationData = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      const loc = r.locationTH || "อื่นๆ";
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // Logic for Status Overview (Donut Chart)
  const statusData = useMemo(() => {
    const counts = {
      [STATUS.PENDING]: { name: "รอรับงาน", value: 0, color: "#f59e0b" },
      [STATUS.IN_PROGRESS]: { name: "กำลังซ่อม", value: 0, color: "#8b5cf6" },
      [STATUS.COMPLETED]: { name: "เสร็จสิ้น", value: 0, color: "#10b981" },
      [STATUS.CANCELLED]: { name: "ยกเลิก", value: 0, color: "#6b7280" },
    };

    reports.forEach((r) => {
      if (counts[r.status]) {
        counts[r.status].value += 1;
      }
    });

    return Object.values(counts);
  }, []);

  // Logic for Monthly Reports (Bar Chart)
  const monthlyData = useMemo(() => {
    const counts = new Array(12).fill(0);
    reports.forEach((r) => {
      if (r.created_at) {
        const month = new Date(r.created_at).getMonth();
        counts[month] += 1;
      }
    });
    return counts.map((value, index) => ({
      name: MONTHS_TH[index],
      value,
    }));
  }, []);

  const THEME_COLOR = "#c0392b";

  return (
    <>
      <section className="hero hero-dashboard">
        <div className="hero-inner">
          <h1>Admin Dashboard</h1>
          <p className="hero-sub">แดชบอร์ดผู้ดูแลระบบ</p>
          <p className="hero-desc">
            Track and manage repair requests in ECC building
          </p>

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
                  <div className="work-name">รับผิดชอบโดยฉัน</div>
                  <div className="work-sub-1">Accepted by me</div>
                </div>
                <div className="work-num">5</div>
              </div>

              <div className="work-row work-amber">
                <div>
                  <div className="work-name">เหลือวันนี้</div>
                  <div className="work-sub-2">Remaining today</div>
                </div>
                <div className="work-num">3</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-section-title">ภาพรวมสถิติ / Statistics</div>
        
        <div className="dashboard-charts-grid">
          {/* Chart 1: Reports by Location */}
          <Card className="dashboard-chart-card">
            <div className="dash-head">
              <div className="dash-title">รายงานแบ่งตามสถานที่ / By Location</div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" fill={THEME_COLOR} radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Status Overview (Donut) */}
          <Card className="dashboard-chart-card">
            <div className="dash-head">
              <div className="dash-title">สัดส่วนสถานะงาน / Status Overview</div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 3: Monthly Reports */}
          <Card className="dashboard-chart-card">
            <div className="dash-head">
              <div className="dash-title">จำนวนแจ้งซ่อมรายเดือน / Monthly</div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" fill={THEME_COLOR} radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="dash-grid">
          <Card className="dash-main">
            <div className="dash-head">
              <div className="dash-title">
                รายงานการซ่อมใหม่ / New Repair Reports
              </div>
              <Link to="/requests" className="dash-link">
                ดูทั้งหมด / View All
              </Link>
            </div>

            <div className="list">
              {reports.slice(0, 3).map((r) => (
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
              <li>
                <span className="dot dot-ok" /> รับแจ้งซ่อมรายการล่าสุด • 5
                นาทีที่แล้ว
              </li>
              <li>
                <span className="dot dot-blue" /> เปลี่ยนสถานะเป็นกำลังดำเนินการ
                • 15 นาทีที่แล้ว
              </li>
              <li>
                <span className="dot dot-amber" /> รายการรอรับงาน • 1
                ชั่วโมงที่แล้ว
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
