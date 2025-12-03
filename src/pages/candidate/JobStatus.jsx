import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function JobStatus() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await jobSeekerAPI.getMyApplications({
          page: 1,
          limit: 100,
        });
        // Handle paginated response
        const applicationsData = response.data?.data || response.data || [];
        setApplications(
          Array.isArray(applicationsData) ? applicationsData : []
        );
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusConfig = {
    all: {
      label: "All Applications",
      color: "gray",
      count: applications.length,
    },
    pending: {
      label: "Pending",
      color: "blue",
      count: applications.filter((a) => a.status === "pending").length,
    },
    reviewing: {
      label: "Reviewing",
      color: "yellow",
      count: applications.filter((a) => a.status === "reviewing").length,
    },
    interview: {
      label: "Interview",
      color: "purple",
      count: applications.filter((a) => a.status === "interview").length,
    },
    accepted: {
      label: "Accepted",
      color: "green",
      count: applications.filter((a) => a.status === "accepted").length,
    },
    rejected: {
      label: "Rejected",
      color: "red",
      count: applications.filter((a) => a.status === "rejected").length,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-neutral-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const filteredApplications =
    activeFilter === "all"
      ? applications
      : applications.filter((app) => app.status === activeFilter);

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        class: "bg-blue-100 text-blue-700 border border-blue-200",
        icon: "⏱️",
        label: "Pending",
      },
      reviewing: {
        class: "bg-amber-100 text-amber-700 border border-amber-200",
        icon: "👀",
        label: "Under Review",
      },
      interview: {
        class: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        icon: "📞",
        label: "Interview",
      },
      accepted: {
        class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        icon: "✅",
        label: "Accepted",
      },
      rejected: {
        class: "bg-gray-200 text-gray-700 border border-gray-300",
        icon: "❌",
        label: "Rejected",
      },
    };
    const statusInfo = config[status] || {
      class: "bg-gray-100 text-gray-600 border border-gray-200",
      icon: "📋",
      label: status,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.class}`}
      >
        <span>{statusInfo.icon}</span>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - giống HomePage */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  JobMatch
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/companies"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Companies
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Saved Jobs */}
                  <Link
                    to="/saved"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                    title="Saved Jobs"
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </Link>

                  {/* Notifications */}
                  <button
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                    title="Notifications"
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/applications"
                          className="block px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 transition-colors"
                        >
                          My Applications
                        </Link>
                        <Link
                          to="/saved"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          Saved Jobs
                        </Link>
                        <Link
                          to="/cv"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          My CV
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate("/");
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}

      {/* Header Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Applications
                </h1>
              </div>
              <p className="text-gray-600">
                Track your job applications and interview schedules
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(statusConfig).map(([key, config]) => {
              const colors = {
                all: "from-gray-50 to-gray-100 border-gray-200",
                pending: "from-blue-50 to-blue-100 border-blue-200",
                reviewing: "from-amber-50 to-amber-100 border-amber-200",
                interview: "from-indigo-50 to-indigo-100 border-indigo-200",
                accepted: "from-emerald-50 to-emerald-100 border-emerald-200",
                rejected: "from-gray-50 to-gray-100 border-gray-300",
              };
              return (
                <div
                  key={key}
                  className={`bg-gradient-to-br ${colors[key]} border rounded-lg p-4 text-center hover:shadow-sm transition-shadow`}
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {config.count}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    {config.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filter by Status
            </h2>
            {filteredApplications.length > 0 && (
              <span className="text-sm text-gray-500">
                Showing {filteredApplications.length} application
                {filteredApplications.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusConfig).map(([key, config]) => {
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeFilter === key
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200"
                  }`}
                >
                  <span>{config.label}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeFilter === key
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {config.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Applications List - giống Jobs Section của HomePage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "all"
                  ? "Start applying to jobs to see your applications here"
                  : `No ${statusConfig[
                      activeFilter
                    ]?.label.toLowerCase()} applications yet`}
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Jobs →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Company Logo */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {app.job?.company?.logoUrl ? (
                          <img
                            src={app.job.company.logoUrl}
                            alt={app.job.company.companyName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 hover:text-indigo-600">
                          {app.job?.title || "Job Title"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {app.job?.company?.companyName || "Company"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Skills/Tags */}
                  {app.job?.skills && app.job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.job.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {app.job.skills.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                          +{app.job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Job Details - giống format của HomePage */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span>
                        {app.job?.location?.city ||
                          app.job?.location ||
                          "Location"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 capitalize">
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{app.job?.jobType || "Full-time"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {app.job?.salaryRange?.min && app.job?.salaryRange?.max
                          ? `${app.job.salaryRange.min.toLocaleString()} - ${app.job.salaryRange.max.toLocaleString()} VND`
                          : "Negotiable"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {app.notes && (
                    <div className="mb-4 p-3 bg-blue-50 border-l-3 border-blue-400 rounded-r text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">{app.notes}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/jobs/${app.job?._id}`}
                      className="flex-1 min-w-[120px] py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-center text-sm"
                    >
                      View Job
                    </Link>
                    {app.status === "interview" && (
                      <button className="flex-1 min-w-[120px] py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all text-sm shadow-sm">
                        📞 Join Interview
                      </button>
                    )}
                    {app.status === "accepted" && (
                      <button className="flex-1 min-w-[120px] py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all text-sm shadow-sm">
                        🎉 View Offer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default JobStatus;
