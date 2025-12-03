import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { jobSeekerAPI } from "../services/api";
import ApplyJobModal from "../components/ApplyJobModal";

function PublicJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [similarJobs, setSimilarJobs] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobId, setSavedJobId] = useState(null); // Store the savedJob ID
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    // Only check saved status for jobseekers (backend uses "js" as role)
    if (user && (user.role === "jobseeker" || user.role === "js")) {
      checkSavedStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const checkSavedStatus = async () => {
    try {
      const response = await jobSeekerAPI.getSavedJobs({ page: 1, limit: 100 });
      const savedJobsData = response.data?.data || response.data || [];
      const savedItem = savedJobsData.find((saved) => {
        const jobId = saved.job?._id || saved.job;
        return jobId === id;
      });
      if (savedItem) {
        setIsSaved(true);
        setSavedJobId(savedItem._id); // Store the savedJob ID
      } else {
        setIsSaved(false);
        setSavedJobId(null);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSaveToggle = async () => {
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
      if (isSaved && savedJobId) {
        // Use the savedJob ID, not the job ID
        await jobSeekerAPI.unsaveJob(savedJobId);
        setIsSaved(false);
        setSavedJobId(null);
      } else {
        const response = await jobSeekerAPI.saveJob({ jobId: id });
        setIsSaved(true);
        // Store the savedJob ID for later unsaving
        if (response.data?._id) {
          setSavedJobId(response.data._id);
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(error.response?.data?.message || "Failed to save job");
    }
  };

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/js/jobs/${id}`
      );
      setJob(response.data?.data || response.data);

      // Fetch similar jobs
      try {
        const similarResponse = await axios.get(
          "http://localhost:5000/api/js/jobs/search",
          {
            params: { limit: 3, status: "open" },
          }
        );
        let similarData =
          similarResponse.data?.data?.data ||
          similarResponse.data?.data ||
          similarResponse.data ||
          [];
        setSimilarJobs(
          Array.isArray(similarData)
            ? similarData.filter((j) => j._id !== id).slice(0, 3)
            : []
        );
      } catch (err) {
        console.error("Error fetching similar jobs:", err);
      }
    } catch (err) {
      console.error("Error fetching job:", err);
      setError("Job not found or has been removed");
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min || !salaryRange?.max) return "Negotiable";
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} VND`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
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
                <span className="text-xl font-bold text-gray-900">
                  JobMatch
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                to="/jobs"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Jobs
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

                  {/* Profile Dropdown */}
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {job.company?.companyName?.[0] || "C"}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-700 mb-3">
                    {job.company?.companyName}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                      <span>{job.location?.city || "Not specified"}</span>
                    </span>
                    <span>•</span>
                    <span>
                      {getWorkModeEmoji(job.workMode)} {job.workMode}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{job.jobType}</span>
                    <span>•</span>
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Apply Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Ready to apply?
                    </h3>
                    <p className="text-gray-600">
                      Sign in to submit your application
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(!user ||
                      user.role === "jobseeker" ||
                      user.role === "js") && (
                      <button
                        onClick={handleSaveToggle}
                        className="px-6 py-3 bg-white border-2 border-indigo-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2"
                        title={isSaved ? "Unsave job" : "Save job"}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isSaved
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
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    )}
                    {user &&
                    (user.role === "jobseeker" || user.role === "js") ? (
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                      >
                        Apply Now →
                      </button>
                    ) : (
                      <Link
                        to={`/login?redirect=/jobs/${id}`}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                      >
                        Apply Now →
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-teal-100 text-teal-700 font-medium rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Job Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Salary</p>
                  <p className="font-semibold text-gray-900">
                    {formatSalary(job.salaryRange)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Type</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {job.jobType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Work Mode</p>
                  <p className="font-semibold text-gray-900">
                    {getWorkModeEmoji(job.workMode)} {job.workMode}
                  </p>
                </div>
                {job.experienceLevel && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Experience Level
                    </p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {job.experienceLevel}
                    </p>
                  </div>
                )}
                {job.category && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-semibold text-gray-900">
                      {job.category}
                    </p>
                  </div>
                )}
                {job.deadline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Application Deadline
                    </p>
                    <p className="font-semibold text-red-600">
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                )}
              </div>

              <Link
                to={`/login?redirect=/jobs/${id}`}
                className="w-full mt-6 block text-center py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply for This Job
              </Link>
              <Link
                to="/register"
                className="w-full mt-3 block text-center py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Create Account
              </Link>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Similar Jobs
                </h3>
                <div className="space-y-4">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob._id}
                      to={`/jobs/${similarJob._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {similarJob.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {similarJob.company?.companyName}
                      </p>
                      <p className="text-sm text-indigo-600 font-medium">
                        {formatSalary(similarJob.salaryRange)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Job Modal */}
      <ApplyJobModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={id}
        jobTitle={job?.title || ""}
      />
    </div>
  );
}

export default PublicJobDetail;
