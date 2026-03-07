import React, { useMemo, useState, useEffect} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Link, useSearchParams } from "react-router-dom";
import { Pill } from "../../components/UI.jsx";
import { STATUS} from "../../../data/mock.js";
import { supabase } from "../../supabaseClient";



export default function ManageRequests() {
  const [AdminData, setAdmin] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [reports, setReports] = useState([]);
  // const [reportstat, setReportstat] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategoty] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const pageSize = 8;
  const [searchParams] = useSearchParams();

function statusToThai(status) {
  const s = String(status || "").toUpperCase().trim();

  const map = {
    PENDING: "รอรับงาน",
    ACCEPTED: "รับงานแล้ว",
    IN_PROGRESS: "กำลังดำเนินการ",
    COMPLETED: "เสร็จสิ้น",
    REJECTED: "ปฏิเสธ",
    CANCELLED: "ยกเลิก",
  };

  return map[s] || status || "";
}

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
    const fetchLocation = async () =>{
      if(!token){
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try{
        const locationsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/locations`,{
          method: "GET",
          headers: {Authorization: `Bearer ${token}`},
        });
        
        if (!locationsResponse.ok) {
          if (locationsResponse.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
          }
          throw new Error(`HTTP error! status: ${locationsResponse.status}`);
        }
        const allLocation = await locationsResponse.json();
        setLocation(allLocation);
      }catch(err){
        setError(err.message || "Failed to fetch reports check the API.");
      }finally{
        setLoading(false);
      }
    };
    const fetchCategory = async () =>{
      if(!token){
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try{
        const TypeResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/asset-categories`,{
          method: "GET",
          headers: {Authorization: `Bearer ${token}`},
        });
        
        if (!TypeResponse.ok) {
          if (TypeResponse.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
          }
          throw new Error(`HTTP error! status: ${TypeResponse.status}`);
        }
        const Typeall = await TypeResponse.json();
        setCategoty(Typeall);
      }catch(err){
        setError(err.message || "Failed to fetch reports check the API.");
      }finally{
        setLoading(false);
      }
    };
    fetchUserData();
    fetchReports();
    fetchLocation();
    fetchCategory();
  
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "accepted") {
      setActiveTab("accepted");
      setPage(1);
    } else if (tab === "progress") {
      setActiveTab("progress");
      setPage(1);
    } else if (tab === "done") {
      setActiveTab("done");
      setPage(1);
    } else if (tab === "new") {
      setActiveTab("new");
      setPage(1);
    } else if (tab === "all") {
      setActiveTab("all");
      setPage(1);
    }
  }, [searchParams]);
  useEffect(() => {
  const tab = searchParams.get("tab");

  if (tab === "accepted") {
    setActiveTab("accepted");
    setPage(1);
  } else if (tab === "progress") {
    setActiveTab("progress");
    setPage(1);
  } else if (tab === "done") {
    setActiveTab("done");
    setPage(1);
  } else if (tab === "new") {
    setActiveTab("new");
    setPage(1);
  } else if (tab === "all") {
    setActiveTab("all");
    setPage(1);
  }
}, [searchParams]);

  const filtered = useMemo(() => {

    if (!Array.isArray(reports)) return [];
    let items = [...reports];

    if (activeTab === "new") items = items.filter((i) => i.status === "PENDING");
    if (activeTab === "progress") items = items.filter((i) => i.status === "IN_PROGRESS");
    if (activeTab === "done") items = items.filter((i) => i.status === "COMPLETED");
    if (activeTab === "accepted") items = items.filter((i) => i.status === "ACCEPTED");
    if (activeTab === "myAccepted") items = items.filter((i) => i.assigned === AdminData.name && (i.status === "ACCEPTED" || i.status === "IN_PROGRESS"));

    if (status) items = items.filter((i) => i.status === status);

    if (selectedLocation) items = items.filter((i) => 
      i.locationTH && i.locationTH.includes(selectedLocation));


    if (type) items = items.filter((i) => i.typeTH.includes(type));

    if (startDate || endDate) {
      items = items.filter((i) => {
        if (!i.dateEN) return false;
        
        const reportDate = new Date(i.dateEN).getTime();
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate ? new Date(endDate).getTime() : Infinity;

        // ตั้งค่าให้ end ครอบคลุมถึงสิ้นวัน (23:59:59) เพื่อไม่ให้ตกหล่น
        const endWithTime = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;

        return reportDate >= start && reportDate <= endWithTime;
      });
    }

    if (sort === "oldest") items.reverse();
    if (sort === "status") {
      const order = {

        ["pending"]: 1,
        ["in_progress"]: 2,
        ["completed"]: 3,
        ["accepted"]: 4,
      };
      items.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    }

    return items;
  }, [reports, activeTab, status, selectedLocation, type, sort, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setStatus("");
    setLocation("");
    setType("");
    setSort("latest");
    setStartDate(""); // ล้างวันที่เริ่ม
    setEndDate("");   // ล้างวันที่สิ้นสุด
    setPage(1);
  };

  const TABS = [
  { key: "all", label: "ทั้งหมด / All", count: reports.length },
  { key: "new", label: "ใหม่ / New", count: reports.filter(r => r.status === "PENDING").length },
  { key: "accepted", label: "รับงาน / Accepted", count: reports.filter(r => r.status === "ACCEPTED").length },
  { key: "progress", label: "กำลังดำเนินการ / In Progress", count: reports.filter(r => r.status === "IN_PROGRESS").length },
  { key: "done", label: "เสร็จสิ้น / Completed", count: reports.filter(r => r.status === "COMPLETED").length },
  { key: "myAccepted", label: "งานที่ฉันรับ / My Accepted", count: reports.filter(r => r.assigned === AdminData.name && (r.status === "ACCEPTED" || r.status === "IN_PROGRESS")).length },
];

  return (
    <>
      <section className="hero hero-manage">
        <h1>จัดการคำขอซ่อม / Manage Repair Requests</h1>
        <p>ระบบจัดการและติดตามคำขอซ่อมบำรุงทั้งหมด</p>
      </section>

      <main className="container">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(t.key);
                setPage(1);
              }}
              type="button"
            >
              {t.label} <span className="tab-count">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="filters">
          <div className="filters-row">
            <select value={reports.status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">ทุกสถานะ / All Status</option>
              <option value="PENDING">รอรับงาน (Pending)</option>
              <option value="ACCEPTED">รับงานแล้ว (Accepted)</option>
              <option value="IN_PROGRESS">กำลังดำเนินการ (In Progress)</option>
              <option value="COMPLETED">เสร็จสิ้น (Completed)</option>
            </select>

            <select value={selectedLocation} onChange={(e) => {
              setSelectedLocation(e.target.value),
              setPage(1);
            }}>
              <option value="">สถานที่ / Location</option>
                {Array.isArray(locations) && locations.map((l) => (
                  <option key={l.id || l.name} value={l.name}>
                    {l.name}
                  </option>
                ))}
            </select>

            <select value={type} onChange={(e) => 
              setType(e.target.value)}>
              <option value="">ประเภท / Type</option>
              {Array.isArray(category) && category.map((c) =>
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              )}
            </select>
            <div className="date-range">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                aria-label="from date" 
              />
              <span className="to">to</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                aria-label="to date" 
              />
            </div>
          </div>

          <div className="filters-row bottom">
            <button className="link-danger" type="button" onClick={reset}>
              ✖ ล้างตัวกรอง
            </button>

            <div className="sort">
              <span>(เรียงตาม)</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">ใหม่ล่าสุด / Newest</option>
                <option value="oldest">เก่าสุด / Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid">
          {current.map((item) => (
            <article key={item.id} className="card">
              <div className="card-img">
                <img src={item.img} alt={item.titleEN} />
              </div>

              <div className="card-body">
                <div className="card-top">
                  <div>
                    <div className="card-title">{item.titleTH}</div>
                    <div className="card-sub">{item.locationTH}</div>
                  </div>
                  <Pill tone={statusTone(item.status.toLowerCase())}>
                    {statusToThai(item.status)}
                  </Pill>
                </div>

                <div className="card-meta">
                  <span className="muted">{item.assigned}</span>
                  <span className="muted">{item.dateTH}</span>
                </div>

                <Link className="btn-danger" to={`/requests/${item.id}`}>
                  ดูรายละเอียด
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="list-footer">
          <div className="muted">
            แสดง {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} จาก{" "}
            {filtered.length} รายการ
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).slice(0, 6).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`page-num ${page === p ? "active" : ""}`}
                  onClick={() => setPage(p)}
                  type="button"
                >
                  {p}
                </button>
              );
            })}

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
