import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export default function Toast({ id, message, type, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give some time for exit animation before calling onDismiss
      setTimeout(() => onDismiss(id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  const toastClass = `${styles.toast} ${styles[type]} ${isVisible ? styles.enter : styles.exit}`;

  return (
    <div className={toastClass} onClick={handleClick}>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton}>&times;</button>
    </div>
  );
}
