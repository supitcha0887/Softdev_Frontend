import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/Toast";
import styles from "./NotificationContext.module.css";

const NotificationContext = createContext(null);

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const portalElement = document.getElementById("toast-root");
  if (!portalElement) {
    // Create the portal root if it doesn't exist
    const newPortalRoot = document.createElement("div");
    newPortalRoot.id = "toast-root";
    document.body.appendChild(newPortalRoot);
  }

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className={styles.toastContainer}>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
          ))}
        </div>,
        document.getElementById("toast-root")
      )}
    </NotificationContext.Provider>
  );
}
