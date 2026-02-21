import { useState } from "react";
import { supabase } from "../../supabaseClient";
import styles from "./Register.module.css";
import mailIcon from "../../assets/Mail.png";
import eyeIcon from "../../assets/Eyes.png";
import bgImage from "../../assets/BG.jpg";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // 1. สร้าง State สำหรับเก็บค่าที่ตรงกับ Database
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    setLoading(true);

    // 2. เรียกใช้ signUp และส่ง Metadata ไปพร้อมกัน
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName, // จะถูก Trigger ดึงไปใส่ตาราง public.users
          phone: phone, // จะถูก Trigger ดึงไปใส่ตาราง public.users
        },
      },
    });

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("ลงทะเบียนสำเร็จ! โปรดตรวจสอบอีเมลยืนยัน");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.left}>
        <h1 className={styles.title}>Sign up</h1>

        <form onSubmit={handleRegister}>
          {/* เพิ่มช่องชื่อ-นามสกุล */}
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* เพิ่มช่องเบอร์โทรศัพท์ */}
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src={mailIcon} alt="mail" style={{ cursor: "default" }} />
          </div>

          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={eyeIcon}
              alt="eye"
              onClick={() => setShowPassword(!showPassword)}
              style={{ opacity: showPassword ? 0.4 : 1, cursor: "pointer" }}
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <img
              src={eyeIcon}
              alt="eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ opacity: showConfirmPassword ? 0.4 : 1, cursor: "pointer" }}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.text}>
          <h1>Hello, Friend!</h1>
          <h2>Create an account</h2>
          <div className={styles.line}></div>
        </div>
      </div>
    </div>
  );
}

export default Register;