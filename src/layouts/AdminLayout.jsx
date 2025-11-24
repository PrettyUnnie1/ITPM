import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Admin</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Quản lý người dùng</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
