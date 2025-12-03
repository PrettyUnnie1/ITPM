import { Outlet, Link, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-neutral-light">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-light p-6">
        <h2 className="text-xl font-bold text-brand-blue mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <Link
            to="/admin/dashboard"
            className="block text-neutral-dark hover:text-brand-blue"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="block text-neutral-dark hover:text-brand-blue"
          >
            Users Management
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:opacity-90"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
