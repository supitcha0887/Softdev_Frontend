import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageRequests from "./pages/admin/ManageRequests.jsx";
import RequestDetail from "./pages/admin/RequestDetail.jsx";
import UpdateProgress from "./pages/admin/UpdateProgress.jsx";
import CostLogging from "./pages/admin/CostLogging.jsx";
import CloseJob from "./pages/admin/CloseJob.jsx";
import Login from "./pages/user/Login.jsx";
import Register from "./pages/user/Register.jsx";
import ReportPage from "./pages/user/ReportPage.jsx";
import Report from "./pages/user/Report.jsx";
import MyReports from "./pages/user/MyReports.jsx";

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Report />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/my-reports" element={<MyReports />} />

      {/* --- Admin Routes (หน้าที่มี Sidebar/Layout) --- */}
      <Route element={<Layout />}>
        {/* ใช้ Relative Path (ไม่ต้องใส่ / ข้างหน้า) เพื่อความปลอดภัย */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="requests" element={<ManageRequests />} />
        <Route path="requests/:id" element={<RequestDetail />} />
        <Route path="requests/:id/update-progress" element={<UpdateProgress />} />
        <Route path="requests/:id/cost-logging" element={<CostLogging />} />
        <Route path="requests/:id/close-job" element={<CloseJob />} />

        {/* ถ้าอยู่ภายใต้ Layout แล้วหาหน้าไม่เจอ ให้เด้งไป Dashboard */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Global Fallback: ถ้าใส่ URL ผิดจากหน้า Login ให้ดีดกลับไปหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
