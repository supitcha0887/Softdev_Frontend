import React, { useState, useEffect } from "react";
import styles from "./UserNavbar.module.css";
import icon from "../assets/Icon.png";
import searchIcon from "../assets/Search.jpg";
import notificationIcon from "../assets/Notification.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function UserNavbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // ดึงชื่อผู้ใช้จาก Supabase session
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // ดึงจาก user_metadata ที่ส่งตอน Register (full_name)
        const name = user.user_metadata?.full_name || user.email || "User";
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  return (
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
        <span>List</span>
        {/* ปุ่ม Notification */}
        <button className={styles.notificationBtn}>
          <img
            src={notificationIcon}
            alt="notification"
            className={styles.notificationIcon}
          />
        </button>
        {/* ปุ่มแสดงชื่อผู้ใช้ */}
        {userName && (
          <button className={styles.userNameBtn}>{userName}</button>
        )}
        <button
          className={styles.signin}
          onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
