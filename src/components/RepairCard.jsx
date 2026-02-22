import styles from "./RepairCard.module.css";
import noImg from "../assets/No_img.jpg";

const statusMap = {
  pending:     { label: "รอซ่อม",           style: "pending" },
  in_progress: { label: "กำลังดำเนินการ",   style: "in_progress" },
  completed:   { label: "เสร็จสิ้น",         style: "completed" },
  cancelled:   { label: "ยกเลิก",           style: "cancelled" },
};

function RepairCard({ image, title, status, date }) {
  const statusInfo = statusMap[status] ?? { label: status, style: "" };

  return (
    <div className={styles.card}>
      {/* รูปภาพ */}
      <div className={styles.imageBox}>
        <img src={image || noImg} alt="repair" />
      </div>

      {/* เนื้อหา */}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>

        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>สถานะ</span>
          <span className={`${styles.statusBadge} ${styles[statusInfo.style]}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>วันที่แจ้งซ่อม</span>
          <span className={styles.dateValue}>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default RepairCard;