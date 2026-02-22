import React, { useState, useEffect } from "react";
import styles from "./NotificationPopup.module.css";
import { supabase } from "../supabaseClient";

function NotificationPopup({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: notificationsData, error: fetchError } = await supabase
          .from("notifications")
          .select(`
            *,
            related_report_id,
            reports (technician_id, technician_info:users!technician_id(full_name))
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setNotifications(notificationsData);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const optionsDate = { year: "numeric", month: "short", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: false };
    return ` ${date.toLocaleDateString("en-GB", optionsDate)} at ${date.toLocaleTimeString("en-GB", optionsTime)}`;
  };

  const getStatusBadgeClass = (type) => {
    switch (type) {
      case "in_progress":
        return styles.badgeInProgress;
      case "completed":
        return styles.badgeCompleted;
      case "pending":
        return styles.badgePending;
      default:
        return styles.badgeInfo;
    }
  };

  const getStatusBadgeLabel = (type) => {
    switch (type) {
      case "in_progress":
        return "กำลังดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
      case "pending":
        return "รอตรวจสอบ";
      default:
        return "ข้อมูล";
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h3 className={styles.popupTitle}>Notifications</h3>
        <div className={styles.notificationList}>
          {loading && <p className={styles.loadingText}>Loading notifications...</p>}
          {error && <p className={styles.errorText}>Error: {error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className={styles.noNotifications}>No new notifications.</p>
          )}
          {!loading && !error && notifications.map((notification, index) => (
            <React.Fragment key={notification.notification_id}>
              <div className={styles.notificationItem}>
                <div className={styles.itemHeader}>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(notification.type)}`}>
                    {getStatusBadgeLabel(notification.type)}
                  </span>
                  <span className={styles.dateTime}>{formatDateTime(notification.created_at)}</span>
                </div>
                <p className={styles.itemTitle}>{notification.title}</p>
                <p className={styles.itemDescription}>{notification.description}</p>
                {notification.reports?.technician_id && notification.reports?.technician_info?.full_name && (
                  <p className={styles.technicianName}>นายช่าง: {notification.reports.technician_info.full_name}</p>
                )}
              </div>
              {index < notifications.length - 1 && <div className={styles.itemDivider} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
