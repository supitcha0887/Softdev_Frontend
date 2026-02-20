import { useState, useEffect } from "react";
import styles from "./Report.module.css";
import icon from "./assets/Icon.png";
import searchIcon from "./assets/Search.jpg";
import bg from "./assets/BG.jpg";
import engineerIcon from "./assets/Engineer.png";
import maintainIcon from "./assets/Maintain.png";
import locationIcon from "./assets/Location.png";
import closeIcon from "./assets/Close.png";
import RepairCard from "./RepairCard";
import { useNavigate } from "react-router-dom";
import { supabase, getAccessToken } from "./supabaseClient";

// ================= DETAIL POPUP COMPONENT =================
function Detail({ item, onClose }) {
  if (!item) return null;

  // ปรับให้ตรงกับสถานะใน Database
  const statusLabel = {
    in_progress: "กำลังดำเนินการซ่อมแซม",
    completed: "เสร็จสิ้น",
    pending: "รอการอนุมัติ",
  };

  const statusColor = {
    in_progress: "#ef4444",
    completed: "#22c55e",
    pending: "#ffa500",
  };

  return (
    <div className={styles.detailWrapper} onClick={onClose}>
      <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtnIcon} onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>

        <div className={styles.detailImageWrapper}>
          <img
            src={item.image}
            alt={item.title}
            className={styles.detailImage}
          />
          <div
            className={styles.detailStatusBadge}
            style={{ background: statusColor[item.status] ?? "#888" }}
          >
            {statusLabel[item.status] ?? item.status}
          </div>
        </div>

        <div className={styles.detailBody}>
          <h3 className={styles.detailTitle}>{item.title}</h3>
          <p className={styles.detailMeta}>
            เลขครุภัณฑ์ : {item.assetNo || "ไม่ระบุ"}
          </p>
          <p className={styles.detailMeta}>วันที่แจ้งซ่อม : {item.date}</p>

          <hr className={styles.detailDivider} />

          {/* รายละเอียดเพิ่มเติมจาก Database */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>รายละเอียดปัญหา</p>
            <p className={styles.detailDesc}>
              {item.description || "ไม่มีรายละเอียดเพิ่มเติม"}
            </p>
          </div>

          <hr className={styles.detailDivider} />

          <div className={styles.section}>
            <p className={styles.sectionTitle}>ผู้แจ้งรายงานปัญหา</p>
            <div className={styles.row}>
              <div className={styles.iconCircle}>
                <img src={engineerIcon} alt="reporter" />
              </div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 600 }}>
                  {item.reporterName}
                </span>
              </div>
            </div>
          </div>

          <hr className={styles.detailDivider} />

          <div className={styles.section}>
            <p className={styles.sectionTitle}>สถานะการดำเนินการ</p>
            <div className={styles.row}>
              <div className={styles.iconCircle}>
                <img src={maintainIcon} alt="status" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "16px",
                    color: statusColor[item.status] ?? "#888",
                    fontWeight: "700",
                  }}
                >
                  {statusLabel[item.status] ?? item.status}
                </span>
              </div>
            </div>
          </div>

          <hr className={styles.detailDivider} />

          <div className={styles.section}>
            <p className={styles.sectionTitle}>สถานที่ซ่อมบำรุง</p>
            <div className={styles.row}>
              <div className={styles.iconCircle}>
                <img src={locationIcon} alt="location" />
              </div>
              <span style={{ fontSize: "15px", color: "#444" }}>
                {item.location}
              </span>
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= REPORT COMPONENT =================
function Report() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [repairItems, setRepairItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงรายการทั้งหมดเพื่อแสดงใน Grid
  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:5000/api/Report/All", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          status: item.status,
          image: item.image || "https://via.placeholder.com/150",
          date: new Date(item.date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          reporterName: item.reporter_name || "ไม่ระบุชื่อ",
          // ✅ ดึงชื่อสถานที่จริงมาใช้จากการ JOIN หลังบ้าน
          location: item.location_name || "ไม่ระบุสถานที่",
          assetNo: item.asset_number || null,
        }));
        setRepairItems(mappedData);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ดึงข้อมูลฉบับเต็มเมื่อคลิกดู Detail (รวม Description)
  const handleOpenDetail = async (item) => {
    // เซ็ตข้อมูลเบื้องต้นที่มีอยู่แล้วเพื่อให้ UI ตอบสนองทันที
    setSelectedItem(item);

    try {
      const token = await getAccessToken();
      const response = await fetch(
        `http://localhost:5000/api/Report/${item.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const fullData = await response.json();
        // อัปเดต State ด้วยรายละเอียดเพิ่มเติม (เช่น description)
        setSelectedItem((prev) => ({
          ...prev,
          description: fullData.description,
          // อัปเดตชื่อสถานที่และผู้แจ้งให้แน่นอนอีกครั้ง
          location: fullData.location_name || prev.location,
          reporterName: fullData.reporterName || prev.reporterName,
        }));
      }
    } catch (error) {
      console.error("Error fetching full details:", error);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <div className={styles.navbar}>
        <img
          src={icon}
          className={styles.logo}
          onClick={() => navigate("/home")}
          alt="icon"
        />
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search here" />
          <img src={searchIcon} alt="search" />
        </div>
        <div className={styles.navLinks}>
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={fetchRepairs}>List</span>
          <button
            className={styles.signin}
            onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className={styles.hero} style={{ backgroundImage: `url(${bg})` }}>
        <h1>
          ระบบรายงานครุภัณฑ์เสียหายภายใน
          <br />
          ภาควิชาคอมพิวเตอร์ อาคาร ECC
        </h1>
        <button
          className={styles.reportBtn}
          onClick={() => navigate("/create-report")}
        >
          Report
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.listSection}>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <h4>Sort by</h4>
            <p>สถานะ</p>
            <label>
              <input type="checkbox" /> รอซ่อม
            </label>
            <label>
              <input type="checkbox" /> กำลังดำเนินการ
            </label>
            <label>
              <input type="checkbox" /> เสร็จสิ้น
            </label>
          </div>

          <div className={styles.rightContent}>
            <h3>รายการแจ้งซ่อมทั้งหมดจากฐานข้อมูล</h3>
            {loading ? (
              <div className={styles.loader}>กำลังโหลดข้อมูล...</div>
            ) : (
              <div className={styles.grid}>
                {repairItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <RepairCard
                      image={item.image}
                      title={item.title}
                      status={item.status}
                      date={item.date}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>ระบบรายงานครุภัณฑ์เสียหายภายในภาควิชาคอมพิวเตอร์ อาคาร ECC</p>
        <span>Copyright ©2026 CEDT | PSPD Project</span>
      </div>

      {selectedItem && (
        <Detail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default Report;
