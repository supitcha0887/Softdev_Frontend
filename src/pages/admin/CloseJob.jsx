import React, { useState,useEffect,useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Pill } from "../../components/UI";
// import { reports as mockReports, repair_costs, updateReportStatus, STATUS } from "../../../data/mock";
import styles from "./CloseJob.module.css";

export default function CloseJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;

  const [report, setReport] = useState(null);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalCost = useMemo(() => {
      return costs.reduce((sum, item) => sum + (item.total_price || 0), 0);
    }, [costs]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const reportRes = await fetch(
          `${API}/AdminManage/repair-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!reportRes.ok) throw new Error("Report not found");

        const reportData = await reportRes.json();
        setReport(reportData);

        const costRes = await fetch(
          `${API}/AdminAsset/repair-requests/${id}/costs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (costRes.ok) {
          const costData = await costRes.json();
          setCosts(costData || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const duration = useMemo(() => {
    if (!report?.started_at) return "N/A";
    const end = report.completed_at ? new Date(report.completed_at) : new Date();
    const start = new Date(report.started_at);
    const diff = end - start;
    if (diff < 0) return "0 นาที";
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours > 0 ? `${hours} ชั่วโมง ` : ""}${minutes} นาที`;
  }, [report]);

  const handleConfirmClose = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API}/AdminManage/repair-requests/${id}/close`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            closingNote: "ปิดงานเรียบร้อย",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to close job");

      alert("ปิดงานซ่อมเรียบร้อยแล้ว");
      navigate("/requests");

    } catch (err) {
      alert(err.message);
    }
  };

  if (!report) {
    return (
      <main className="container">
        <Card>
          <h2>ไม่พบข้อมูลคำร้อง</h2>
          <Link to="/requests">กลับไปหน้ารายการ</Link>
        </Card>
      </main>
    );
  }

  return (
    <>
      <section className="hero hero-manage">
        <h1>ปิดงานซ่อม / Close Job</h1>
        <p>ยืนยันการปิดงานและบันทึกผลการซ่อม</p>
      </section>

      <nav className={`container ${styles.breadcrumb}`}>
        <Link to="/">หน้าหลัก</Link> {" > "} <Link to="/requests">รายการแจ้งซ่อม</Link> {" > "} <span>ปิดงาน #{id}</span>
      </nav>

      <main className={`container ${styles.mainGrid}`}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          {/* Section 1: ข้อมูล Report */}
          <Card className={styles.sectionCard}>
            <div className={styles.reportHeader}>
              <div>
                <h2 className={styles.reportTitle}>{report.titleTH}</h2>
                <p className={styles.reportSubtitle}>{report.titleEN}</p>
              </div>
              <Pill tone={report.status === "completed" ? "ok" : "progress"}>
                {report.status}
              </Pill>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Request ID</label>
                <span>#{report.id}</span>
              </div>
              <div className={styles.infoItem}>
                <label>สถานที่ (Location)</label>
                <span>{report.locationTH}</span>
              </div>
              <div className={styles.infoItem}>
                <label>หมายเลขครุภัณฑ์ (Asset No.)</label>
                <span>{report.assetNo}</span>
              </div>
              <div className={styles.infoItem}>
                <label>ผู้แจ้ง (Reporter)</label>
                <span>{report.reporter}</span>
                <small className={styles.muted}>{report.tel}</small>
              </div>
            </div>
          </Card>

          {/* Section 2: สถานะการดำเนินงาน */}
          <Card className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>สถานะการดำเนินงาน / Status Timeline</h3>
            <div className={styles.timeline}>
              {report.progress && Array.isArray(report.progress) ? (
                report.progress.map((step, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <strong>{step.title}</strong>
                        <span className={styles.timelineDate}>
                          {new Date(step.date).toLocaleString("th-TH")}
                        </span>
                      </div>
                      {step.description && <p>{step.description}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.muted}>ไม่มีข้อมูลความคืบหน้า</p>
              )}
            </div>
          </Card>

          {/* Section 3: สรุปงานซ่อม */}
          <Card className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>สรุปงานซ่อม / Work Summary</h3>
            <div className={styles.summaryBox}>
               <label>บันทึกการทำงาน</label>
               <div className={styles.workNotes}>
                 {report.description || "ไม่มีบันทึกการทำงาน"}
               </div>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>ช่างผู้รับผิดชอบ</label>
                <span>{report.assigned}</span>
              </div>
              <div className={styles.infoItem}>
                <label>ระยะเวลาซ่อม</label>
                <span>{duration}</span>
              </div>
            </div>
          </Card>

          {/* Section 4: รายละเอียดค่าใช้จ่าย */}
          <Card className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>รายละเอียดค่าใช้จ่าย / Cost Breakdown</h3>
            <div className={styles.costTable}>
              {costs.length > 0 ? (
                costs.map((item, idx) => (
                  <div key={idx} className={styles.costRow}>
                    <div className={styles.costName}>
                      {item.item_name}
                      <small className={styles.muted}>จำนวน {item.quantity} ชิ้น</small>
                    </div>
                    <div className={styles.costValue}>
                      ฿{item.total_price.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.muted}>ไม่มีรายการค่าใช้จ่าย</p>
              )}
              <div className={`${styles.costRow} ${styles.totalRow}`}>
                <strong>รวมทั้งหมด / Total Cost</strong>
                <strong className={styles.totalText}>฿{totalCost.toLocaleString()}</strong>
              </div>
            </div>
          </Card>

          {/* Section 5: รูปภาพหลังซ่อม */}
          <Card className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>รูปภาพหลังซ่อม / After Repair Photos</h3>
            <div className={styles.imageContainer}>
              {report.image_after_url ? (
                <img src={report.image_after_url} alt="After repair" />
              ) : (
                <div className={styles.noImage}>
                   <p>ไม่มีรูปภาพหลังซ่อม</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <Card className={styles.statusCard}>
            <div className={styles.statusIcon}>✓</div>
            <h3>งานซ่อมเสร็จสมบูรณ์</h3>
            <p>ระบบพร้อมส่งงานปิดทดสอบเรียบร้อยแล้ว</p>
          </Card>

          <div className={styles.actionGroup}>
            <button className={styles.confirmBtn} onClick={handleConfirmClose}>
              ยืนยันปิดงาน / Mark as Completed
            </button>
            <button className={styles.outlineBtn} onClick={() => navigate(`/requests/${id}/update-progress`)}>
              แก้ไขข้อมูล / Edit Details
            </button>
            <button className={styles.outlineBtn} onClick={() => navigate(`/requests/${id}/cost-logging`)}>
              แก้ไขค่าใช้จ่าย / Edit Cost
            </button>
          </div>

          <Card className={styles.infoCard}>
            <h4 className={styles.infoCardTitle}>ข้อมูลเพิ่มเติม / Additional Info</h4>
            <div className={styles.kvRow}>
              <span>เริ่มงาน:</span>
              <strong>{report.started_at ? new Date(report.started_at).toLocaleString("th-TH") : "-"}</strong>
            </div>
            <div className={styles.kvRow}>
              <span>ระยะเวลา:</span>
              <strong>{duration}</strong>
            </div>
            <div className={styles.kvRow}>
              <span>ช่าง:</span>
              <strong>{report.assigned}</strong>
            </div>
            <div className={styles.kvRow}>
              <span>ค่าใช้จ่าย:</span>
              <strong>฿{totalCost.toLocaleString()}</strong>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}