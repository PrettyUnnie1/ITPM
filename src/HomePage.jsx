import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { VIETNAM_CITIES } from "./constants";
import { jobSeekerAPI } from "./services/api";

function HomePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobMap, setSavedJobMap] = useState({}); // Map jobId -> savedJobId

  const fetchSearchSuggestions = useCallback(async () => {
    try {
      const response = await jobSeekerAPI.searchJobs({
        keyword: searchKeyword,
        limit: 5,
        status: "open",
      });
      let jobsData =
        response.data?.data?.data || response.data?.data || response.data || [];
      setSearchSuggestions(Array.isArray(jobsData) ? jobsData : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, [searchKeyword]);

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
    fetchCities();
    // Debug: Log user info
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    // Only fetch saved jobs for jobseekers (backend uses "js" as role)
    if (user && (user.role === "jobseeker" || user.role === "js")) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const response = await jobSeekerAPI.getSavedJobs({ page: 1, limit: 100 });
      // Response.data contains paginated results or an array
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
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!user) {
      window.location.href = "/login";
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

  // Debounce search suggestions to avoid too many API calls
  useEffect(() => {
    if (searchKeyword.length > 1) {
      // Add 500ms delay before fetching suggestions
      const debounceTimer = setTimeout(() => {
        fetchSearchSuggestions();
      }, 500);

      // Cleanup previous timer
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchKeyword, fetchSearchSuggestions]);

  const fetchCities = () => {
    // Use predefined cities list from constants
    setLocationSuggestions(VIETNAM_CITIES);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("🌐 Fetching jobs from API:", import.meta.env.VITE_API_URL);

      const response = await jobSeekerAPI.searchJobs({ limit: 6, page: 1 });
      console.log("Jobs response:", response);

      // Try different response structures
      let jobsData =
        response.data?.data?.jobs || // Paginated response with jobs key
        response.data?.data?.data || // Nested data.data.data
        response.data?.jobs || // Direct jobs key
        response.data?.data || // data.data array
        response.data || // Direct data array
        [];

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      console.log("✅ Extracted jobs:", jobsData.length, "jobs");
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      console.log(
        "🏢 Fetching companies from API:",
        import.meta.env.VITE_API_URL
      );

      const response = await jobSeekerAPI.searchCompanies({
        limit: 20,
        page: 1,
      });
      console.log("Companies response:", response);

      // Try different response structures
      let companiesData =
        response.data?.data?.companies || // Paginated response with companies key
        response.data?.data?.data || // Nested data.data.data
        response.data?.companies || // Direct companies key
        response.data?.data || // data.data array
        response.data || // Direct data array
        [];

      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      console.log("✅ Extracted companies:", companiesData.length, "companies");
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      setCompanies([]);
    }
  };

  const handleSearch = () => {
    // Navigate to public job search page with filters
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (location) params.append("location", location);
    window.location.href = `/jobs?${params.toString()}`;
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

  // Mock job data (fallback if no real data)
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechViet Solutions",
      location: "Hanoi",
      type: "Full-time",
      salary: "20,000,000 - 30,000,000 VND",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      saved: false,
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      company: "VinAI Research",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "25,000,000 - 40,000,000 VND",
      posted: "1 day ago",
      tags: ["Python", "TensorFlow", "PyTorch"],
      saved: true,
    },
    {
      id: 3,
      title: "Product Designer",
      company: "Tiki Corporation",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "18,000,000 - 25,000,000 VND",
      posted: "3 days ago",
      tags: ["Figma", "UI/UX", "Design System"],
      saved: false,
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "Momo E-wallet",
      location: "Hanoi",
      type: "Full-time",
      salary: "20,000,000 - 30,000,000 VND",
      posted: "1 week ago",
      tags: ["Node.js", "MongoDB", "Microservices"],
      saved: false,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "FPT Software",
      location: "Da Nang",
      type: "Full-time",
      salary: "22,000,000 - 35,000,000 VND",
      posted: "4 days ago",
      tags: ["AWS", "Docker", "Kubernetes"],
      saved: false,
    },
    {
      id: 6,
      title: "Data Analyst",
      company: "Shopee Vietnam",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "15,000,000 - 23,000,000 VND",
      posted: "5 days ago",
      tags: ["SQL", "Python", "Power BI"],
      saved: false,
    },
  ];

  // Use real data if available, fallback to mock
  const displayJobs = jobs.length > 0 ? jobs : mockJobs;
  const displayCompanies = companies.length > 0 ? companies : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/companies"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Companies
                </Link>
                <Link
                  to="/employer/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  For Employers
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {authLoading ? (
                // Loading skeleton while checking auth
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
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
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm font-medium text-indigo-600">
                Find jobs with AI
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover thousands of job opportunities that match your skills
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search jobs, positions..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() =>
                    searchSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((job) => (
                      <Link
                        key={job._id}
                        to={`/jobs/${job._id}`}
                        className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {job.company?.companyName?.[0] || "C"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {job.company?.companyName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <span>{job.location?.city}</span>
                              <span>•</span>
                              <span className="capitalize">{job.jobType}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowLocationSuggestions(false), 200)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {locationSuggestions
                      .filter(
                        (city) =>
                          !location ||
                          city.toLowerCase().includes(location.toLowerCase())
                      )
                      .map((city, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setLocation(city);
                            setShowLocationSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
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
                            <span className="text-gray-900">{city}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs For You Section */}
      <section className="py-12 bg-white">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">For You</h2>
              </div>
              <p className="text-gray-600">Jobs that match your profile</p>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View All
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs available
              </h3>
              <p className="text-gray-600">
                Check back later for new opportunities
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Horizontal Scroll Container */}
              <div
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {displayJobs.map((job) => (
                  <Link
                    key={job._id || job.id}
                    to={job._id ? `/jobs/${job._id}` : "#"}
                    className="flex-none w-[350px] bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow snap-start"
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
                            {job.company?.companyName || job.company}
                          </p>
                        </div>
                      </div>
                      {(!user ||
                        user.role === "jobseeker" ||
                        user.role === "js") && (
                        <button
                          onClick={(e) =>
                            handleSaveToggle(job._id || job.id, e)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={
                            savedJobIds.includes(job._id || job.id)
                              ? "Unsave job"
                              : "Save job"
                          }
                        >
                          <svg
                            className={`w-6 h-6 ${
                              savedJobIds.includes(job._id || job.id)
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
                      {(job.skills || job.tags || [])
                        .slice(0, 3)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"
                          >
                            {tag}
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
                        <span>{job.location?.city || job.location}</span>
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
                        <span>{job.jobType || job.type}</span>
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
                          {job.salaryRange
                            ? formatSalary(job.salaryRange)
                            : job.salary}
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
                          {job.createdAt
                            ? formatDate(job.createdAt)
                            : job.posted}
                        </span>
                      </div>
                    </div>

                    <div className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
                      View Details
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/jobs"
              className="inline-block px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              View More Jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-12 bg-gray-50">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">
                  Company List
                </h2>
              </div>
              <p className="text-gray-600">Top employers hiring now</p>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View All
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-20 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : displayCompanies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No companies available at the moment.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Horizontal Scroll Container */}
              <div
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {displayCompanies.map((company) => (
                  <Link
                    key={company._id}
                    to={`/companies/${company._id}`}
                    className="flex-none w-[300px] bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow snap-start"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.companyName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {company.companyName || company.name}
                        </h3>
                        {company.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {company.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {company.industry && (
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full mb-3">
                        {company.industry}
                      </span>
                    )}

                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      {company.city && (
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
                          <span>{company.city}</span>
                        </div>
                      )}
                      {company.companySize && (
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>{company.companySize}</span>
                        </div>
                      )}
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
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {company.totalJobs || company.jobs || 0} open
                          positions
                        </span>
                      </div>
                    </div>

                    <div className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm text-center">
                      View Company
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for the Next Step?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Upload your CV and let AI help you find the most suitable job
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/candidate/login"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Upload CV
            </Link>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
