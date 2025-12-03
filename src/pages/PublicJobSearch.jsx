import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { jobSeekerAPI } from "../services/api";
import {
  WORK_MODES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  VIETNAM_CITIES,
} from "../constants";

function PublicJobSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobMap, setSavedJobMap] = useState({}); // Map jobId -> savedJobId
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    workMode: "",
    jobType: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
    // Only fetch saved jobs for jobseekers (backend uses "js" as role)
    if (user && (user.role === "jobseeker" || user.role === "js")) {
      fetchSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const response = await jobSeekerAPI.getSavedJobs({ page: 1, limit: 100 });
      const savedJobsData = response.data?.data || response.data || [];
      const savedIds =
        savedJobsData.map((saved) => saved.job?._id || saved.job) || [];
      // Create a map from job ID to saved job ID for unsaving
      const jobMap = {};
      savedJobsData.forEach((saved) => {
        const jobId = saved.job?._id || saved.job;
        if (jobId) {
          jobMap[jobId] = saved._id;
        }
      });
      setSavedJobIds(savedIds);
      setSavedJobMap(jobMap);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleSaveToggle = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    // Only jobseekers can save jobs (backend uses "js" as role)
    if (user.role !== "jobseeker" && user.role !== "js") {
      alert("Only job seekers can save jobs");
      return;
    }

    try {
      if (savedJobIds.includes(jobId)) {
        // Use the savedJob ID (from the map), not the job ID
        const savedJobId = savedJobMap[jobId];
        if (savedJobId) {
          await jobSeekerAPI.unsaveJob(savedJobId);
          setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
          // Remove from map
          const newMap = { ...savedJobMap };
          delete newMap[jobId];
          setSavedJobMap(newMap);
        }
      } else {
        const response = await jobSeekerAPI.saveJob({ jobId });
        // Store both the job ID in the array and the mapping
        setSavedJobIds([...savedJobIds, jobId]);
        // Save the savedJob ID in the map for later unsaving
        if (response.data?._id) {
          setSavedJobMap({ ...savedJobMap, [jobId]: response.data._id });
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(error.response?.data?.message || "Failed to save job");
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.workMode) params.workMode = filters.workMode;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.experienceLevel)
        params.experienceLevel = filters.experienceLevel;
      params.status = "open";

      const response = await axios.get(
        "http://localhost:5001/api/js/jobs/search",
        {
          params,
        }
      );

      let jobsData =
        response.data?.data?.data || response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min || !salaryRange?.max) return "Negotiable";
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} VND`;
  };

  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const getWorkModeEmoji = (mode) => {
    switch (mode) {
      case "onsite":
        return "🏢";
      case "remote":
        return "🌏";
      case "hybrid":
        return "🔄";
      default:
        return "💼";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
              <span className="text-xl font-bold text-gray-900">JobMatch</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/companies"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Companies
              </Link>
              <Link
                to="/employer/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                For Employers
              </Link>

              {authLoading ? (
                // Loading skeleton while checking auth
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <>
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

                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
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
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/applications"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Applications
                        </Link>
                        <Link
                          to="/saved"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Saved Jobs
                        </Link>
                        <Link
                          to="/cv"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My CV
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
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
                <Link
                  to="/login"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                >
                  Login
                </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Jobs</h1>
          <p className="text-gray-600">
            Found {jobs.length} jobs matching your criteria
          </p>
        </div>

        {/* Search & Filters */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search jobs, keywords..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {VIETNAM_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={filters.workMode}
              onChange={(e) =>
                setFilters({ ...filters, workMode: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Work Modes</option>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode.toLowerCase().replace("-", "")}>
                  {mode === "On-site" && "🏢 "}
                  {mode === "Remote" && "🌏 "}
                  {mode === "Hybrid" && "🔄 "}
                  {mode}
                </option>
              ))}
            </select>
            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters({ ...filters, jobType: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type.toLowerCase().replace("-", "")}>
                  {type === "Full-time" && "💼 "}
                  {type === "Part-time" && "⏰ "}
                  {type === "Contract" && "📝 "}
                  {type === "Internship" && "🎓 "}
                  {type === "Freelance" && "💻 "}
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.experienceLevel}
              onChange={(e) =>
                setFilters({ ...filters, experienceLevel: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option
                  key={level}
                  value={level.toLowerCase().replace(/[ -]/g, "")}
                >
                  {level}
                </option>
              ))}
              <option value="lead">Lead</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search Jobs
          </button>
        </form>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
                      {job.company?.companyName?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        {job.company?.companyName}
                      </p>
                    </div>
                  </div>
                  {(!user ||
                    user.role === "jobseeker" ||
                    user.role === "js") && (
                    <button
                      onClick={(e) => handleSaveToggle(job._id, e)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={
                        savedJobIds.includes(job._id)
                          ? "Unsave job"
                          : "Save job"
                      }
                    >
                      <svg
                        className={`w-6 h-6 ${
                          savedJobIds.includes(job._id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
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
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(job.skills || []).slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

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
                    <span>{job.location?.city || "Not specified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>
                      {getWorkModeEmoji(job.workMode)} {job.workMode}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{job.jobType}</span>
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
                    <span>{formatSalary(job.salaryRange)}</span>
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
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                <div className="w-full py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors text-center">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicJobSearch;
