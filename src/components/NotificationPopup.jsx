import React, { useState, useEffect } from "react";
import styles from "./NotificationPopup.module.css";


function NotificationPopup({ onClose, setUnreadCount }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAndMarkNotifications = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch notifications
        const notificationsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Notification/MyNotifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!notificationsResponse.ok) throw new Error(`HTTP error! status: ${notificationsResponse.status}`);
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);

        // Mark all as read
        const markAsReadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Notification/MarkAllAsRead`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!markAsReadResponse.ok) throw new Error(`HTTP error! status: ${markAsReadResponse.status}`);
        setUnreadCount(0); // Update unread count in UserNavbar

      } catch (err) {
        console.error("Error fetching or marking notifications:", err);
        setError(err.message || "Failed to fetch or mark notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkNotifications();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formatted = date.toLocaleString("th-TH");
    return formatted;
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
                  <span className={styles.dateTime}>{formatDateTime(notification.create_at)}</span>
                </div>
                <p className={styles.itemTitle}>{notification.title}</p>
                <p className={styles.itemDescription}>{notification.desc}</p>
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
