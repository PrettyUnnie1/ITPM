import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jobSeekerAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SavedJobs() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.getSavedJobs({ page: 1, limit: 100 });
      // Handle both paginated and non-paginated responses
      const data = response.data?.data || response.data || [];
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      console.error("Error response:", error.response?.data);
      console.error("Validation errors:", error.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedJobId) => {
    try {
      // savedJobId is the _id of the SavedJob document, not the job ID
      await jobSeekerAPI.unsaveJob(savedJobId);
      setSavedJobs(savedJobs.filter((item) => item._id !== savedJobId));
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
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
                    className="p-2 text-indigo-600 bg-indigo-50 rounded-lg transition-colors relative"
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
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          My Applications
                        </Link>
                        <Link
                          to="/saved"
                          className="block px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 transition-colors"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
              </div>
              <p className="text-gray-600">Jobs you've saved for later</p>
            </div>
            <div className="flex items-center space-x-3">
              {!loading && savedJobs.length > 0 && (
                <span className="text-sm text-gray-500 px-4 py-2 bg-gray-100 rounded-lg font-medium">
                  {savedJobs.length} saved{" "}
                  {savedJobs.length === 1 ? "job" : "jobs"}
                </span>
              )}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
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
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No saved jobs yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring and save jobs you're interested in
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
              {savedJobs.map((item) => {
                const job = item.job || {};
                return (
                  <Link
                    key={item._id}
                    to={`/jobs/${job._id}`}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {job.company?.logoUrl ? (
                            <img
                              src={job.company.logoUrl}
                              alt={job.company?.companyName || "Company"}
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
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.company?.companyName || "Company"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnsave(item._id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Unsave job"
                      >
                        <svg
                          className="w-6 h-6 text-red-500 fill-current"
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
                      </button>
                    </div>

                    {/* Skills/Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Job Details - giống HomePage */}
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
                        <span>{job.location?.city || "Remote"}</span>
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
                        <span>{job.jobType}</span>
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
                          {job.salaryRange?.min && job.salaryRange?.max
                            ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} VND`
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
                          Saved{" "}
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
                      View Details
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SavedJobs;
