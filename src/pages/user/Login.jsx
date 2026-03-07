import React, { useState } from "react";

import "./Login.css";
import bg from "../../assets/BG.jpg";
import mailIcon from "../../assets/Mail.png";
import eyeIcon from "../../assets/Eyes.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useNotification } from "../../contexts/NotificationContext";

function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ ฟังก์ชัน Login หลัก
  const handleLogin = async () => {
    if (!email || !password) {
      showToast("กรุณากรอกอีเมลและรหัสผ่าน", "warning");
      return;
    }

    setLoading(true);
    try {
      // 1. ยืนยันตัวตนกับ Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const token = data.session.access_token;
      console.log("================== SUPABASE TOKEN ==================");
      console.log(token);
      console.log("====================================================");
      localStorage.setItem("token", token); // เก็บ Token ไว้ใช้ในหน้าอื่นๆ

      // 2. ตรวจสอบ Role ของผู้ใช้จาก Backend (ASP.NET)
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง Token เพื่อตรวจสอบสิทธิ์
        },
      });

      if (res.ok) {
        const result = await res.json();
        showToast("เข้าสู่ระบบสำเร็จ", "success");
        if (result.isAdmin) {
          navigate("/dashboard"); // ไปหน้า Admin Dashboard ถ้าเป็น Admin
        } else {
          navigate("/home"); // ไปหน้า Home ถ้าเป็น User ทั่วไป
        }
      } else {
        showToast(`การยืนยันตัวตนล้มเหลว (Status: ${res.status})`, "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showToast("Login failed: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      {/* LEFT SIDE (OVERLAY) */}
      <div className="overlay">
        <p>We happy to help</p>
        <h1>WELCOME</h1>
        <div className="line"></div>
      </div>

      {/* RIGHT SIDE (LOGIN FORM) */}
      <div className="right">
        <h2>Login</h2>

        <div className="input-box">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <img src={mailIcon} className="icon" alt="mail" style={{ cursor: "default" }} />
        </div>

        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={eyeIcon}
            className="icon"
            alt="eye"
            onClick={() => setShowPassword(!showPassword)}
            style={{ opacity: showPassword ? 0.4 : 1, cursor: "pointer" }}
          />
        </div>

        <button className="forgot">Forgot your password?</button>

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register" onClick={() => navigate("/register")}>
          Don't have an account? <span>Register</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
