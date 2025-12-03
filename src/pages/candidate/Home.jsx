import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";

function CandidateHome() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Stats
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    successRate: "94%",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (activeTab === "forYou") {
        // Fetch recommended jobs for user
        const response = await jobSeekerAPI.getRecommendedJobs();
        const jobsData = response.data?.data || response.data || [];
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } else if (activeTab === "explore") {
        // Fetch all active jobs
        const response = await jobSeekerAPI.searchJobs({
          status: "open",
          limit: 20,
        });
        const jobsData = response.data?.data || response.data || [];
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } else if (activeTab === "saved") {
        // Fetch saved jobs
        const response = await jobSeekerAPI.getSavedJobs();
        const savedData = response.data?.data || response.data || [];
        setSavedJobs(Array.isArray(savedData) ? savedData : []);
        setJobs(savedData.map((item) => item.job).filter(Boolean));
      }

      // Fetch stats
      const allJobsResponse = await jobSeekerAPI.searchJobs({ limit: 1 });
      const allCompaniesResponse = await jobSeekerAPI.searchCompanies({
        limit: 1,
      });
      setStats((prev) => ({
        ...prev,
        totalJobs: allJobsResponse.data?.pagination?.total || 0,
        totalCompanies: allCompaniesResponse.data?.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await jobSeekerAPI.searchJobs({
        keyword: searchKeyword,
        location: searchLocation,
        status: "open",
      });
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setActiveTab("explore");
    } catch (error) {
      console.error("Error searching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const isSaved = savedJobs.some((item) => item.job?._id === jobId);
      if (isSaved) {
        await jobSeekerAPI.unsaveJob(jobId);
        setSavedJobs(savedJobs.filter((item) => item.job?._id !== jobId));
      } else {
        await jobSeekerAPI.saveJob({ jobId });
        const response = await jobSeekerAPI.getSavedJobs();
        const savedData = response.data?.data || response.data || [];
        setSavedJobs(Array.isArray(savedData) ? savedData : []);
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
    }
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
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="max-w-4xl">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-sm font-medium">
              ✨ Your Dream Job Awaits
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Career Match
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Discover thousands of opportunities tailored to your skills and
            preferences
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl p-2 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
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
                  placeholder="Job title, keywords, or company"
                  className="flex-1 bg-transparent border-none outline-none text-gray-700"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-400 mr-3"
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
                  className="flex-1 bg-transparent border-none outline-none text-gray-700"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Jobs Available</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalJobs.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Companies Hiring</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalCompanies.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.successRate}
              </p>
            </div>
            <div className="text-4xl">✨</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-1">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("forYou")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "forYou"
                ? "bg-primary-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🎯 For You
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "explore"
                ? "bg-primary-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🔍 Explore All
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "saved"
                ? "bg-primary-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            💾 Saved Jobs
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "forYou" && "Recommended For You"}
              {activeTab === "explore" && "All Jobs"}
              {activeTab === "saved" && "Saved Jobs"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "forYou" &&
                "Jobs matching your profile and preferences"}
              {activeTab === "explore" && "Browse all available opportunities"}
              {activeTab === "saved" && "Jobs you've bookmarked"}
            </p>
          </div>
          <Link
            to="/candidate/jobs"
            className="px-6 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const isSaved = savedJobs.some(
                (item) => item.job?._id === job._id
              );

              return (
                <div
                  key={job._id}
                  className="card p-6 hover:border-primary-300 border-2 border-transparent transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="flex items-start space-x-4 flex-1"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {job.company?.logoUrl ? (
                          <img
                            src={job.company.logoUrl}
                            alt={job.company.companyName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span>🏢</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">
                          {job.company?.companyName || "Company"}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveJob(job._id);
                      }}
                      className={`p-2 transition-colors duration-200 ${
                        isSaved
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill={isSaved ? "currentColor" : "none"}
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

                  {/* Details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge badge-primary capitalize">
                      {job.jobType || "Full-time"}
                    </span>
                    <span className="badge badge-secondary">
                      📍 {job.location?.city || job.location || "Location"}
                    </span>
                    <span className="badge badge-success">
                      💰 {formatSalary(job.salaryRange)}
                    </span>
                  </div>

                  {/* Tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>🕐 {formatDate(job.createdAt)}</span>
                    </div>
                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateHome;
