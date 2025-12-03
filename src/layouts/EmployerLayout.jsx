import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function EmployerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/employer/login");
  };

  const navItems = [
    {
      path: "/employer/dashboard",
      label: "Dashboard",
      icon: "📊",
      description: "Overview & stats",
    },
    {
      path: "/employer/company-profile",
      label: "Company Profile",
      icon: "🏢",
      description: "Manage company info",
    },
    {
      path: "/employer/jobs",
      label: "Jobs",
      icon: "💼",
      description: "Manage job postings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Enhanced */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700">
            <Link
              to="/employer/dashboard"
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                JM
              </div>
              <div>
                <span className="block text-xl font-bold text-white">
                  JobMatch
                </span>
                <span className="block text-xs text-gray-400">
                  Employer Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info Card */}
          <div className="px-4 py-4">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || "E"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "Employer"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || "employer@company.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-start space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isActive(item.path) ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive(item.path) && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="px-4 py-3 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Active Jobs</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-white">0</div>
                <div className="text-xs text-gray-400">Applications</div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Enhanced */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title */}
            <div className="flex-1 mx-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {navItems.find((item) => isActive(item.path))?.icon || "📊"}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {navItems.find((item) => isActive(item.path))?.label ||
                      "Dashboard"}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {navItems.find((item) => isActive(item.path))
                      ?.description || "Overview & stats"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <Link
                to="/employer/jobs"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Post Job</span>
              </Link>

              {/* Notifications */}
              <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Profile Dropdown */}
              <Link
                to="/employer/company-profile"
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-all"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "E"}
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.name || "Employer"}
                  </div>
                  <div className="text-xs text-gray-500">View Profile</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default EmployerLayout;
