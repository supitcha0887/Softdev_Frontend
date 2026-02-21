import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageRequests from "./pages/ManageRequests.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import Login from "./Login";
import Register from "./Register";
import Report from "./Report";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/requests" element={<ManageRequests />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Report />} />
      </Route>
    </Routes>
  );
}
