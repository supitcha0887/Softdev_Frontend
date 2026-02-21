import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageRequests from "./pages/ManageRequests.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Report from "./Report.jsx";

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Report />} />

      {/* --- Admin Routes (หน้าที่มี Sidebar/Layout) --- */}
      <Route element={<Layout />}>
        {/* ใช้ Relative Path (ไม่ต้องใส่ / ข้างหน้า) เพื่อความปลอดภัย */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="requests" element={<ManageRequests />} />
        <Route path="requests/:id" element={<RequestDetail />} />

        {/* ถ้าอยู่ภายใต้ Layout แล้วหาหน้าไม่เจอ ให้เด้งไป Dashboard */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Global Fallback: ถ้าใส่ URL ผิดจากหน้า Login ให้ดีดกลับไปหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
