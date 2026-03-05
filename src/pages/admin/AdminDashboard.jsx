import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Pill } from "../../components/UI.jsx";
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

import { supabase } from "../../supabaseClient"; 

const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

import pending from "../../assets/pending.svg";
import progress from "../../assets/progress.svg";
import finish from "../../assets/finish.svg";


export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [reportstat, setReportstat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [AdminData, setAdmin] = useState("");

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
    const fetchReports = async () =>{
      if(!token){
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try{
        const reportsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/reports`,{
          method: "GET",
          headers: {Authorization: `Bearer ${token}`},
        });
        
        if (!reportsResponse.ok) {
          if (reportsResponse.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
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
    fetchUserData();
    fetchReports();

}, []);


  const all_report_cal = (report) => {
    const pendingReports = report.filter(rep => rep.status.toLowerCase() === "pending").length;
    const acceptedReports = report.filter(rep => rep.status.toLowerCase() === "accepted").length;
    const inprogressReport = report.filter(rep => rep.status.toLowerCase() === "in_progress").length;
    const completedReports = report.filter(rep => rep.status.toLowerCase() === "completed").length;
    return [
      {th_stat: "รอรับงาน", en_stat:"Pending", value: pendingReports, pill:"PENDING", tone: "muted", icon: pending},
      {th_stat: "รับงานแล้ว", en_stat:"Accepted", value: acceptedReports, pill:"ACCEPTED", tone: "muted", icon: pending},
      {th_stat: "กำลังดำเนินการ", en_stat: "In Progress", value: inprogressReport, pill: "IN_PROGRESS", tone: "progress", icon: progress },
      {th_stat: "เสร็จสิ้น", en_stat: "Completed", value: completedReports, pill: "COMPLETED", tone: "ok", icon: finish },
    ];
  };
 const statusTone = (s) => {
    if (s === "completed") return "ok";
    if (s === "in_progress") return "progress";
    if (s === "accepted") return "plum";
    if (s === "pending") return "warn";
    return "muted";
  };
  const mywork = useMemo(() =>{
    const myreport = reports.filter(rep =>rep.assigned === AdminData.name);

    const count = myreport.length;
    const unfinish = myreport.filter(rep => rep.status.toLowerCase() !== "completed").length;

    return{
      all: count,
      remaining: unfinish
    };
  }, [reports, AdminData.id]);

  const statusData = useMemo(() => {
    const counts = {
      ["pending"]: { name: "รอรับงาน", value: 0, color: "#f59e0b" },
      ["accepted"]: { name: "รับงานแล้ว", value: 0, color: "#8b5cf6"},
      ["in_progress"]: { name: "กำลังซ่อม", value: 0, color: "#3b82f6"  },
      ["completed"]: { name: "เสร็จสิ้น", value: 0, color: "#10b981" },
    };

    reports.forEach((r) => {
      const s = r.status?.toLowerCase();
      if (counts[s]) {
        counts[s].value += 1;
      }
    });

    return Object.values(counts);
  }, [reports]);

  const locationData = useMemo(() => {
    const counts = {};
    reports.forEach((r) => {
      const loc = r.locationTH || "อื่นๆ";
      counts[loc] = (counts[loc] || 0) + 1;
    });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}, [reports]);
  
  const stats = all_report_cal(reports);

  const monthlyData = useMemo(() => {
    const counts = new Array(12).fill(0);
    reports.forEach((r) => {
      if (r.dateEN) {
        const date = new Date(r.dateEN);

        if (!isNaN(date.getTime())) {
            const month = date.getMonth();
            counts[month] += 1;
        }
      }
    });
    return counts.map((value, index) => ({
      name: MONTHS_TH[index],
      value,
    }));
  }, [reports]);

const latestStatusUpdates = useMemo(() => {
  if (!Array.isArray(reports) || reports.length === 0) return [];

  const statuses = ["pending", "accepted", "in_progress", "completed"];
  
  // 1. หาตัวที่ใหม่ที่สุดของแต่ละสถานะ
  const updates = statuses.map((status) => {
    // กรองเอาเฉพาะสถานะนี้และเรียงวันที่ล่าสุด
    const latestForStatus = reports
      .filter((r) => r.status?.toLowerCase() === status)
      .sort((a, b) => new Date(b.dateEN) - new Date(a.dateEN))[0];

    if (!latestForStatus) return null;

    // 2. คำนวณความต่างของเวลา (Optional: ถ้าต้องการโชว์ว่าผ่านไปกี่วันแล้ว)
    const reportDate = new Date(latestForStatus.dateEN);
    const today = new Date();
    const diffTime = Math.abs(today - reportDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 3. กำหนดรายละเอียดการแสดงผล
    const config = {
      pending: { text: "รายการใหม่", dot: "dot-amber", label: "แจ้งมาแล้ว" },
      accepted: { text: "รับงาน", dot: "dot-amber", label: "รับมาแล้ว" },
      in_progress: { text: "กำลังซ่อม", dot: "dot-blue", label: "ซ่อมมาแล้ว" },
      completed: { text: "เสร็จสิ้น", dot: "dot-ok", label: "ปิดงานมาแล้ว" },
    };

    return {
      ...latestForStatus,
      updateText: config[status].text,
      dotClass: config[status].dot,
      daysAgo: diffDays === 0 ? "วันนี้" : `${diffDays} วันที่แล้ว`,
      timeLabel: config[status].label
    };
  }).filter(Boolean); // เอาเฉพาะสถานะที่มีข้อมูลจริง

  return updates;
}, [reports]);
   
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
                {s.th_stat} / {s.en_stat}
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
                <div className="work-num">{mywork.all}</div>
              </div>

              <div className="work-row work-amber">
                <div>
                  <div className="work-name">เหลือวันนี้</div>
                  <div className="work-sub-2">Remaining today</div>
                </div>
                <div className="work-num">{mywork.remaining}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dashboard-section-title">ภาพรวมสถิติ / Statistics</div>
        
        <div className="dashboard-charts-grid">
          {/* Chart 1: Reports by Location  */}
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

        {/* Chart 2: Status Overview (Donut)  */}
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

          {/* Chart 3: Monthly Reports  */}
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
                    <Pill tone={statusTone(r.status.toLowerCase())}>{r.status.toUpperCase()}</Pill>
                    <Link className="btn-danger-sm" to={`/requests/${r.id}`}>
                      เปิด / Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
            <Card className="dash-side">
              <div className="side-title">อัพเดทล่าสุดตามสถานะ / Status Updates</div>
              <ul className="updates">
                {latestStatusUpdates.map((item) => (
                  <li key={`${item.id}-${item.status}`}>
                      <span className={`dot ${item.dotClass}`} />
                        {item.timeLabel}: {item.daysAgo} 
                        ({item.dateTH})
                  </li>
                ))}
                {latestStatusUpdates.length === 0 && (
                  <li style={{ color: '#999', textAlign: 'center' }}>ไม่มีข้อมูลการอัปเดต</li>
                )}
              </ul>
            </Card>
        </div>
      </main>
    </>
  );
}
