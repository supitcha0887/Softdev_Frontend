import React, { useState, useEffect } from "react";
import styles from "./UserNavbar.module.css";
import icon from "../assets/Icon.png";
import searchIcon from "../assets/Search.jpg";
import notificationIcon from "../assets/Notification.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Keep for signOut
import NotificationPopup from "./NotificationPopup";


export default function UserNavbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching Supabase user:", userError);
        setUserName("");
        setUnreadCount(0);
        localStorage.removeItem("token"); // Clear token if user session is invalid
        navigate("/");
        return;
      }

      try {
        // Fetch full_name from Supabase users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserName(profile.full_name || user.email || "User");

        // Fetch unread notification count from backend
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found for unread count.");
          setUnreadCount(0);
          return;
        }

        const unreadCountResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Notification/UnreadCount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!unreadCountResponse.ok) throw new Error(`HTTP error! status: ${unreadCountResponse.status}`);
        const unreadCountData = await unreadCountResponse.json();
        setUnreadCount(unreadCountData.count);

      } catch (error) {
        console.error("Error fetching user profile or unread count:", error);
        setUserName("");
        setUnreadCount(0);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
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
          <span onClick={() => navigate("/my-reports")}>List</span>
          {/* ปุ่ม Notification */}
          <button
            className={styles.notificationBtn}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img
              src={notificationIcon}
              alt="notification"
              className={styles.notificationIcon}
            />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </button>
          {/* ปุ่มแสดงชื่อผู้ใช้ */}
          {userName && (
            <button className={styles.userNameBtn}>{userName}</button>
          )}
          <button
            className={styles.signin}
            onClick={() => {
              supabase.auth.signOut().then(() => {
                localStorage.removeItem("token"); // Clear token on sign out
                navigate("/");
              });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
      {showNotifications && (
        <NotificationPopup
          onClose={() => setShowNotifications(false)}
          setUnreadCount={setUnreadCount}
        />
      )}
    </>
  );
}
