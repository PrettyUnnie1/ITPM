// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UsersManagement from "../pages/admin/UsersManagement";

// Hàm kiểm tra admin đã đăng nhập hay chưa
const isAdminAuthenticated = () => {
  // Sau này bạn thay "adminToken" bằng token thực tế từ backend
  return !!localStorage.getItem("adminToken");
};

// Route bảo vệ khu vực admin
function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    // Nếu chưa login thì đá về trang login
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AdminRoutes() {
  return (
    <Routes>
      {/* Khi vào /admin → tự chuyển về /admin/login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Trang đăng nhập admin */}
      <Route path="login" element={<AdminLogin />} />

      {/* Các route cần đăng nhập mới vào được */}
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
      </Route>

      {/* Nếu gõ nhầm /admin/abc → đưa về login luôn */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
