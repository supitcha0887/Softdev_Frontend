import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageRequests from "./pages/ManageRequests.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/requests" element={<ManageRequests />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
