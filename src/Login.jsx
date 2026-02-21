import React, { useState } from "react";
import "./Login.css";
import bg from "./assets/BG.jpg";
import mailIcon from "./assets/Mail.png";
import eyeIcon from "./assets/Eyes.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ ฟังก์ชัน Login หลัก
  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
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

      // 2. ตรวจสอบการเชื่อมต่อกับ Backend (ASP.NET)
      // เปลี่ยนจาก GET เป็น POST และส่ง JSON Body ให้ตรงกับ LoginRequest ใน C#
      const res = await fetch("http://localhost:5000/api/Auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง Token เผื่อหลังบ้านต้องการตรวจสอบซ้ำ
        },
        body: JSON.stringify({
          token: token, // ชื่อ Property 'token' ต้องตรงกับใน C# (LoginRequest class)
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          navigate("/home"); // ✅ เปลี่ยนไปหน้า Report เมื่อสำเร็จ
        } else {
          alert("Backend ยืนยัน Token ไม่สำเร็จ: " + result.message);
        }
      } else {
        // กรณี Error 405 หรือ 500
        alert(`การยืนยันตัวตนล้มเหลว (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${bg})` }}>
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