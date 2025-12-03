import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";
import { WORK_MODES, JOB_TYPES, EXPERIENCE_LEVELS } from "../../constants";

function Explore() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    workMode: "",
    jobType: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.searchJobs({
        status: "open",
        ...filters,
      });
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await jobSeekerAPI.getSavedJobs();
      const savedData = response.data?.data || response.data || [];
      setSavedJobs(Array.isArray(savedData) ? savedData : []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSaveJob = async (jobId) => {
    try {
      const isSaved = savedJobs.some((item) => item.job?._id === jobId);
      if (isSaved) {
        await jobSeekerAPI.unsaveJob(jobId);
        setSavedJobs(savedJobs.filter((item) => item.job?._id !== jobId));
      } else {
        await jobSeekerAPI.saveJob({ jobId });
        await fetchSavedJobs();
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
    return `${Math.floor(days / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Explore All Jobs</h1>
        <p className="text-gray-600 mt-1">
          Browse all available job opportunities
        </p>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={filters.workMode}
            onChange={(e) =>
              setFilters({ ...filters, workMode: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Experience Levels</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level.toLowerCase().replace(" ", "")}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Search
        </button>
      </form>

      {/* Job Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
        </p>
      </div>

      {/* Job List */}
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
        <div className="space-y-4">
          {jobs.map((job) => {
            const isSaved = savedJobs.some((item) => item.job?._id === job._id);

            return (
              <div
                key={job._id}
                className="card p-6 hover:border-primary-300 border-2 border-transparent transition-all duration-200"
              >
                <div className="flex items-start justify-between">
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
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {job.company?.companyName || "Company"}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
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
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span>
                            {job.workMode === "remote"
                              ? "🌏 Remote"
                              : job.workMode === "hybrid"
                              ? "🔄 Hybrid"
                              : "🏢 Onsite"}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 capitalize">
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
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
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
                        </span>
                        <span>•</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleSaveJob(job._id)}
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
                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Explore;
