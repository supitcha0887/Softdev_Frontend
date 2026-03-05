import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Pill } from "../../components/UI";
import styles from "./UpdateProgress.module.css";
import { compressImage, formatFileSize } from "../../utils/imageUtils";

// Mock icons for meta details, replace with actual icons if available
const LocationIcon = () => "📍";
const UserIcon = () => "👤";
const CalendarIcon = () => "📅";
const CategoryIcon = () => "🏷️";
const DocIcon = () => "📄";

const CHECKLIST_ITEMS = [
  "ตรวจสอบอาการเบื้องต้น (Initial inspection)",
  "ตรวจสอบระบบไฟฟ้า (Check electrical system)",
  "เปลี่ยนชิ้นส่วนที่ชำรุด (Replace damaged parts)",
  "ทดสอบการทำงาน (Test functionality)",
  "ทำความสะอาดและปิดงาน (Clean up and close)",
];

const STATUS_TH = {
  pending: "รอรับงาน",
  accepted: "รับงานแล้ว",
  in_progress: "กำลังดำเนินการ",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

// Map status to CSS module class
const statusToDotClass = {
  pending: styles.pending,
  accepted: styles.accepted,
  in_progress: styles.in_progress,
  completed: styles.completed,
  cancelled: styles.cancelled,
};

export default function UpdateProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ฟอร์ม
  const [status, setStatus] = useState("in_progress");
  const [workNotes, setWorkNotes] = useState("");

  // Checklist state
  const [checkedState, setCheckedState] = useState(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherChecklistItem, setOtherChecklistItem] = useState("");

  // History and Image state
  const [progressHistory, setProgressHistory] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [originalFileSize, setOriginalFileSize] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // ---------- Fetch report (REAL DATA) ----------
  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/AdminManage/repair-requests/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setReport(data);

        // history รองรับทั้ง history/progress (กันรูปแบบ backend ต่างกัน)
        const historyArr = Array.isArray(data.history) ? data.history : Array.isArray(data.progress) ? data.progress : [];
        setProgressHistory(historyArr);
      } catch (e) {
        setError(e.message || "Failed to fetch report.");
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  // sync status เมื่อ report มาแล้ว
  useEffect(() => {
    if (!report?.status) return;
    const s = String(report.status).toLowerCase();
    const validStatuses = ["in_progress", "completed", "cancelled"];
    setStatus(validStatuses.includes(s) ? s : "in_progress");
  }, [report]);

  function statusTone(s) {
    switch (String(s || "").toLowerCase()) {
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

  // ---------- Handlers ----------
  const handleChecklistChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  const handleOtherCheckChange = (e) => {
    setIsOtherChecked(e.target.checked);
    if (!e.target.checked) setOtherChecklistItem("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setOriginalFileSize(null);
      setCompressedFileSize(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (.jpg, .jpeg, .png, .gif, .webp)");
      e.target.value = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 10 MB กรุณาเลือกรูปใหม่");
      e.target.value = null;
      return;
    }

    setOriginalFileSize(formatFileSize(file.size));
    setImagePreview(URL.createObjectURL(file));
    setIsCompressing(true);

    try {
      const compressedFile = await compressImage(file, 10);
      setImageFile(compressedFile);
      setCompressedFileSize(formatFileSize(compressedFile.size));
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("Image compression failed:", err);
      alert("เกิดข้อผิดพลาดในการบีบอัดรูปภาพ");
    } finally {
      setIsCompressing(false);
    }
  };

  // NOTE: ตอนนี้ยังเป็นการบันทึก “ในหน้า” (frontend only)
  // ถ้า backend มี endpoint update progress ค่อยปรับให้ยิง API
  const handleSubmit = (e) => {
    e.preventDefault();

    let checkedItems = CHECKLIST_ITEMS.filter((_, index) => checkedState[index]);
    if (isOtherChecked && otherChecklistItem.trim() !== "") {
      checkedItems.push(otherChecklistItem.trim());
    }

    const newProgress = {
      date: new Date().toISOString(),
      title: STATUS_TH[status] || "อัปเดตสถานะ",
      description: workNotes,
      by: report?.assigned || "STAFF",
      checklist: status === "in_progress" ? checkedItems : [],
      status,
    };

    setProgressHistory((prev) => [...prev, newProgress]);

    // reset form
    setWorkNotes("");
    setCheckedState(new Array(CHECKLIST_ITEMS.length).fill(false));
    setIsOtherChecked(false);
    setOtherChecklistItem("");
    setImageFile(null);
    setImagePreview(null);
    setOriginalFileSize(null);
    setCompressedFileSize(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    alert(`ดำเนินการสถานะ "${STATUS_TH[status]}" สำเร็จ!`);
  };

  // ---------- Guards ----------
  if (loading) {
    return (
      <main className="container">
        <Card>กำลังโหลดข้อมูล...</Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <Card>
          <h2>เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
          <button onClick={() => navigate(`/requests/${id}`)}>ย้อนกลับ</button>
        </Card>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="container">
        <Card>
          <h2>ไม่พบรายการ</h2>
          <p>ไม่พบรายการแจ้งซ่อมที่คุณต้องการ</p>
          <button onClick={() => navigate("/requests")}>ย้อนกลับ</button>
        </Card>
      </main>
    );
  }

  // ---------- Render helpers ----------
  const renderFormContent = () => {
    switch (status) {
      case "in_progress":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="work-notes">บันทึกการทำงาน / Work Notes</label>
              <textarea
                id="work-notes"
                rows="5"
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                placeholder="บันทึกรายละเอียดการทำงาน เช่น ตรวจสอบแล้วพบว่า..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>ขั้นตอนการซ่อม / Repair Checklist</label>
              <div className={styles.checklist}>
                {CHECKLIST_ITEMS.map((name, index) => (
                  <label key={index} className={styles.checkItem}>
                    <input type="checkbox" checked={checkedState[index]} onChange={() => handleChecklistChange(index)} />
                    {name}
                  </label>
                ))}

                <label className={styles.checkItem}>
                  <input type="checkbox" checked={isOtherChecked} onChange={handleOtherCheckChange} />
                  อื่นๆ
                </label>

                {isOtherChecked && (
                  <input
                    type="text"
                    className={styles.otherInput}
                    placeholder="กรอกรายละเอียดขั้นตอนอื่นๆ"
                    value={otherChecklistItem}
                    onChange={(e) => setOtherChecklistItem(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
          </>
        );

      case "completed":
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="work-notes">บันทึกรายละเอียดการทำงาน / Work Notes (Optional)</label>
              <textarea
                id="work-notes"
                rows="5"
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                placeholder="บันทึกรายละเอียดการทำงาน เช่น ตรวจสอบแล้วพบว่า..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="attach-photos">แนบรูปภาพ (ถ้ามี) / Attach Photos - Optional</label>

              <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", borderRadius: "8px" }} />
                ) : (
                  "คลิกเพื่ออัปโหลดรูปภาพ หรือลากไฟล์มาวางที่นี่"
                )}

                {isCompressing && (
                  <div className={styles.loadingOverlay}>
                    <span>กำลังย่อขนาดรูปภาพ...</span>
                  </div>
                )}
              </div>

              {originalFileSize && (
                <p className={styles.fileInfo}>
                  ขนาดไฟล์: {originalFileSize} {compressedFileSize && `→ ${compressedFileSize}`}
                </p>
              )}

              <input
                type="file"
                ref={fileInputRef}
                id="attach-photos"
                style={{ display: "none" }}
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
              />
            </div>
          </>
        );

      case "cancelled":
        return (
          <div className={styles.formGroup}>
            <label htmlFor="work-notes">เหตุผลการยกเลิก / Reason for Cancellation (Optional)</label>
            <textarea
              id="work-notes"
              rows="5"
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              placeholder="ระบุเหตุผลที่ยกเลิกงานซ่อมนี้..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "in_progress":
        return (
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              บันทึกการอัปเดต
            </button>
            <button type="button" className={styles.backButton} onClick={() => navigate(`/requests/${id}`)}>
              ย้อนกลับ
            </button>
          </div>
        );
      case "completed":
        return (
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.saveButton} onClick={() => navigate(`/requests/${id}/cost-logging`)}>
              บันทึกการใช้จ่าย และปิดงาน
            </button>
            <button type="button" className={styles.backButton} onClick={() => navigate(`/requests/${id}`)}>
              ย้อนกลับ
            </button>
          </div>
        );
      case "cancelled":
        return (
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.cancelConfirmButton}>
              ยืนยันการยกเลิก
            </button>
            <button type="button" className={styles.backButton} onClick={() => navigate(`/requests/${id}`)}>
              ย้อนกลับ
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // ---------- UI ----------
  return (
    <>
      <section className="hero hero-manage">
        <h1>อัปเดตความคืบหน้าการซ่อม</h1>
        <p className="hero-sub">Update work progress and status</p>
      </section>

      <main className={`container ${styles.mainGrid}`}>
        {/* Left Panel */}
        <aside className={styles.leftPanel}>
          <Card className={styles.reportCard}>
            <img src={report.img} alt={report.titleEN || report.titleTH || "report"} className={styles.reportImage} />
            <div className={styles.reportId}>
              <span>{report.id}</span>
              <Pill tone={statusTone(report.status)}>{STATUS_TH[String(report.status || "").toLowerCase()] || report.status}</Pill>
            </div>
            <h2 className={styles.reportTitle}>{report.titleTH || report.title || "-"}</h2>
            <div className={styles.reportMeta}>
              <div className={styles.metaItem}>
                <LocationIcon /> {report.locationTH || report.location || "อื่นๆ"}
              </div>
              <div className={styles.metaItem}>
                <UserIcon /> {report.reporter || "-"}
              </div>
              <div className={styles.metaItem}>
                <CalendarIcon /> {report.dateTH || report.date || "-"}
              </div>
              <div className={styles.metaItem}>
                <CategoryIcon /> {report.typeTH || report.assetType || "-"}
              </div>
            </div>
          </Card>
        </aside>

        {/* Center Panel */}
        <section className={styles.centerPanel}>
          <Card className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <h2>
                <DocIcon /> อัปเดตความคืบหน้า
              </h2>

              <div className={styles.formGroup}>
                <label htmlFor="work-status">สถานะงาน</label>
                <select id="work-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="in_progress">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              {renderFormContent()}
              {renderButtons()}
            </form>
          </Card>
        </section>

        {/* Right Panel */}
        <aside className={styles.rightPanel}>
          <Card className={styles.historyCard}>
            <h2>ประวัติการอัปเดต</h2>
            <div className={styles.historyList}>
              {progressHistory.map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={`${styles.historyDot} ${statusToDotClass[item.status] || ""}`} />
                  <p className={styles.historyDate}>
                    {item.date ? new Date(item.date).toLocaleString("th-TH") : "-"}
                  </p>
                  <h3 className={styles.historyTitle}>
                    {STATUS_TH[item.status] || item.title || item.status || "อัปเดต"}
                  </h3>
                  <p className={styles.historyDesc}>{item.description || "-"}</p>
                  <p className={styles.historyBy}>โดย: {item.by || "-"}</p>

                  {item.checklist && item.checklist.length > 0 && (
                    <div className={styles.historyChecklist}>
                      <strong>ขั้นตอนที่ทำ:</strong>
                      <ul>
                        {item.checklist.map((check, i) => (
                          <li key={i}>{check}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              {progressHistory.length === 0 && (
                <div style={{ color: "#64748b", padding: "8px 0" }}>ยังไม่มีการอัปเดตความคืบหน้า</div>
              )}
            </div>
          </Card>
        </aside>
      </main>
    </>
  );
}