import React, { useState, useEffect } from "react";
import styles from "./MyReports.module.css";
import UserNavbar from "../../components/UserNavbar";
import Footer from "../../components/Footer";
import RepairCard from "../../components/RepairCard";
import { supabase } from "../../supabaseClient";

function MyReports() {
  const [myReports, setMyReports] = useState([]);
  const [otherReports, setOtherReports] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all"); // 'all', 'pending', 'in_progress', 'completed', 'cancelled'
  const [sortBy, setSortBy] = useState("date_desc"); // 'date_desc', 'date_asc'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReports();
  }, [currentFilter, sortBy, currentUserId]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      let query = supabase
        .from("reports")
        .select(`
          *,
          locations (location_name, building, floor, room),
          assets (asset_name, asset_number)
        `)
        .order("created_at", { ascending: sortBy === "date_asc" });

      if (currentFilter !== "all") {
        query = query.eq("status", currentFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const my = data.filter(report => report.reporter_id === user.id);
      const others = data.filter(report => report.reporter_id !== user.id);

      setMyReports(my);
      setOtherReports(others);

    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // กรอง ตาม search query (title)
  const filteredMyReports = myReports.filter((r) =>
    searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOtherReports = otherReports.filter((r) =>
    searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("th-TH", options);
  };

  return (
    <div className={styles.container}>
      <UserNavbar onSearch={(q) => setSearchQuery(q)} />

      <main className={styles.mainContent}>
        {/* Section 1: My Repair Reports */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            รายการแจ้งซ่อมของฉัน
            {searchQuery && (
              <span className={styles.searchTag}>
                ค้นหา: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className={styles.clearSearch}>×</button>
              </span>
            )}
          </h2>
          
          <div className={styles.filterSortBar}>
            <div className={styles.statusFilters}>
              <button 
                className={`${styles.filterButton} ${currentFilter === "all" ? styles.active : ""}`}
                onClick={() => setCurrentFilter("all")}>ทั้งหมด</button>
              <button 
                className={`${styles.filterButton} ${currentFilter === "pending" ? styles.active : ""}`}
                onClick={() => setCurrentFilter("pending")}>รอตรวจสอบ</button>
              <button 
                className={`${styles.filterButton} ${currentFilter === "in_progress" ? styles.active : ""}`}
                onClick={() => setCurrentFilter("in_progress")}>กำลังดำเนินการ</button>
              <button 
                className={`${styles.filterButton} ${currentFilter === "completed" ? styles.active : ""}`}
                onClick={() => setCurrentFilter("completed")}>เสร็จสิ้น</button>
              <button 
                className={`${styles.filterButton} ${currentFilter === "cancelled" ? styles.active : ""}`}
                onClick={() => setCurrentFilter("cancelled")}>ยกเลิก</button>
            </div>
            <div className={styles.sortDropdown}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date_desc">เรียงตามวันที่ (ล่าสุด)</option>
                <option value="date_asc">เรียงตามวันที่ (เก่าสุด)</option>
              </select>
            </div>
          </div>

          {loading && <p>Loading reports...</p>}
          {error && <p className={styles.errorText}>Error: {error}</p>}

          {!loading && !error && filteredMyReports.length === 0 && (
            <p>{searchQuery ? `ไม่พบรายการที่มีชื่อ "${searchQuery}"` : "คุณยังไม่มีรายการแจ้งซ่อม"}</p>
          )}

          <div className={styles.reportsGrid}>
            {filteredMyReports.map((report) => (
              <RepairCard
                key={report.report_id}
                image={report.image_before_url}
                title={report.title}
                status={report.status}
                date={formatDate(report.created_at)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Other Repair Reports */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>รายการแจ้งซ่อมอื่นๆ</h2>

          {loading && <p>Loading reports...</p>}
          {error && <p className={styles.errorText}>Error: {error}</p>}

          {!loading && !error && filteredOtherReports.length === 0 && (
            <p>{searchQuery ? `ไม่พบรายการที่มีชื่อ "${searchQuery}"` : "ไม่มีรายการแจ้งซ่อมอื่นๆ"}</p>
          )}

          <div className={styles.reportsGrid}>
            {filteredOtherReports.map((report) => (
              <RepairCard
                key={report.report_id}
                image={report.image_before_url}
                title={report.title}
                status={report.status}
                date={formatDate(report.created_at)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MyReports;