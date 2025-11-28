import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employerAPI } from "../../services/api";
import {
  VIETNAM_CITIES,
  INDUSTRIES,
  JOB_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  JOB_TYPE_MAP,
  WORK_MODE_MAP,
  EXPERIENCE_LEVEL_MAP,
  JOB_TYPE_DISPLAY,
  WORK_MODE_DISPLAY,
  EXPERIENCE_LEVEL_DISPLAY,
} from "../../constants";

function JobsNew() {
  const [view, setView] = useState("list");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    workMode: "On-site", // Display format
    jobType: "Full-time", // Display format
    experienceLevel: "Mid-Level", // Display format
    salaryMin: "",
    salaryMax: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    skills: "",
    benefits: "",
    deadline: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await employerAPI.getMyJobs();
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const response = await employerAPI.getJobApplicants(jobId);
      const appsData = response.data?.data || response.data || [];
      setApplicants(Array.isArray(appsData) ? appsData : []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        location: {
          city: formData.location,
          country: "Vietnam",
          isRemote: formData.workMode === "remote",
        },
        workMode:
          WORK_MODE_MAP[formData.workMode] || formData.workMode.toLowerCase(),
        jobType:
          JOB_TYPE_MAP[formData.jobType] || formData.jobType.toLowerCase(),
        experienceLevel:
          EXPERIENCE_LEVEL_MAP[formData.experienceLevel] ||
          formData.experienceLevel.toLowerCase(),
        salaryRange: {
          min: parseFloat(formData.salaryMin) || 0,
          max: parseFloat(formData.salaryMax) || 0,
          currency: "VND",
        },
        requirements: formData.qualifications,
        responsibilities: formData.responsibilities,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: formData.deadline || undefined,
        status: "open", // Explicitly set status to open
      };

      console.log("Submitting job data:", data);

      if (view === "edit" && selectedJob) {
        const response = await employerAPI.updateJob(selectedJob._id, data);
        console.log("Update response:", response);
        setMessage({ type: "success", text: "✓ Job updated successfully!" });
      } else {
        const response = await employerAPI.postJob(data);
        console.log("Post job response:", response);
        setMessage({ type: "success", text: "✓ Job posted successfully!" });
      }

      await fetchJobs();
      resetForm();
      setTimeout(() => setView("list"), 1500);
    } catch (error) {
      let errorMsg = error.response?.data?.message || "Failed to save job";
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map((err) => err.msg || err.message)
          .join(", ");
        errorMsg = `${errorMsg}: ${validationErrors}`;
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title || "",
      location: job.location?.city || job.location || "",
      workMode: WORK_MODE_DISPLAY[job.workMode] || "On-site",
      jobType: JOB_TYPE_DISPLAY[job.jobType] || "Full-time",
      experienceLevel:
        EXPERIENCE_LEVEL_DISPLAY[job.experienceLevel] || "Mid-Level",
      salaryMin: job.salaryRange?.min || "",
      salaryMax: job.salaryRange?.max || "",
      description: job.description || "",
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities.join("\n")
        : job.responsibilities || "",
      qualifications: job.requirements || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      benefits: "",
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
    });
    setView("edit");
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this job?")) return;

    try {
      await employerAPI.deleteJob(jobId);
      setMessage({ type: "success", text: "✓ Job deleted successfully!" });
      await fetchJobs();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting job:", error);
      setMessage({ type: "error", text: "Failed to delete job" });
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
    setView("applicants");
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await employerAPI.updateApplicationStatus(applicationId, {
        status: newStatus,
      });
      setMessage({ type: "success", text: "✓ Application status updated!" });
      await fetchApplicants(selectedJob._id);
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch {
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      workMode: "On-site", // Display format
      jobType: "Full-time", // Display format
      experienceLevel: "Mid-Level", // Display format
      salaryMin: "",
      salaryMax: "",
      description: "",
      responsibilities: "",
      qualifications: "",
      skills: "",
      benefits: "",
      deadline: "",
    });
    setSelectedJob(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewCandidate = (application) => {
    console.log("Viewing candidate:", application);
    setSelectedCandidate(application);
    setShowCandidateModal(true);
  };

  const closeCandidateModal = () => {
    setShowCandidateModal(false);
    setSelectedCandidate(null);
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && job.status === "open") ||
      (filterStatus === "closed" && job.status === "closed");
    return matchesSearch && matchesStatus;
  });

  // Job List View
  if (view === "list") {
    const jobStats = {
      total: jobs.length,
      open: jobs.filter((j) => j.status === "open").length,
      closed: jobs.filter((j) => j.status === "closed").length,
      draft: jobs.filter((j) => j.status === "draft").length,
      totalApplications: jobs.reduce(
        (sum, job) => sum + (job.totalApplications || 0),
        0
      ),
    };
    return (
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
              <p className="text-gray-600 mt-1">
                Manage your recruitment pipeline
              </p>
            </div>
            <button
              onClick={() => setView("create")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Post New Job</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-transparent hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobStats.total}
                </p>
              </div>
              <div className="text-4xl opacity-20">💼</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-transparent hover:border-green-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobStats.active}
                </p>
              </div>
              <div className="text-4xl opacity-20">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-transparent hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-purple-600">
                  {jobStats.totalApplications}
                </p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-transparent hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-600">
                  {jobStats.closed}
                </p>
              </div>
              <div className="text-4xl opacity-20">🔒</div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-200 text-green-800"
                : "bg-red-50 border-2 border-red-200 text-red-800"
            } animate-fade-in`}
          >
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {["all", "active", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? "No jobs found" : "No jobs posted yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "Start posting jobs to attract top candidates"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setView("create")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl p-6 shadow-sm border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">💼</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h3>
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
                          <span className="capitalize">
                            {job.workMode === "remote"
                              ? "🌏 Remote"
                              : job.workMode === "hybrid"
                              ? "🔄 Hybrid"
                              : "🏢 Onsite"}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{job.jobType}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {job.experienceLevel}
                          </span>
                          <span>•</span>
                          <span>
                            {job.salaryRange?.min?.toLocaleString()} -{" "}
                            {job.salaryRange?.max?.toLocaleString()} VND
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                              job.status === "open"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {job.status === "open" ? "✓ Active" : "Closed"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Posted {formatDate(job.createdAt)}
                          </span>
                          {job.deadline && (
                            <span className="text-sm text-gray-500">
                              Deadline: {formatDate(job.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewApplicants(job)}
                      className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition-all"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{job.totalApplications || 0}</span>
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Create/Edit Form View - Shortened for brevity
  // Use same form structure from original but with better styling
  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {view === "edit" ? "Edit Job Posting" : "Create New Job"}
            </h1>
            <p className="text-gray-600 mt-1">Fill in the job details below</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-all"
          >
            ← Back
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-200 text-green-800"
                : "bg-red-50 border-2 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 shadow-sm space-y-8"
        >
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📝</span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select city...</option>
                  {VIETNAM_CITIES.map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  {WORK_MODES.map((mode) => (
                    <option
                      key={mode}
                      value={mode.toLowerCase().replace("-", "")}
                    >
                      {mode === "On-site" && "🏢 "}
                      {mode === "Remote" && "🌏 "}
                      {mode === "Hybrid" && "🔄 "}
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  {JOB_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type.toLowerCase().replace("-", "")}
                    >
                      {type === "Full-time" && "💼 "}
                      {type === "Part-time" && "⏰ "}
                      {type === "Contract" && "📝 "}
                      {type === "Internship" && "🎓 "}
                      {type === "Freelance" && "💻 "}
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option
                      key={level}
                      value={level.toLowerCase().replace(" ", "")}
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary Min (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="20000000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary Max (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="30000000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Provide a detailed description of the role..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="- Design and implement features&#10;- Collaborate with team members&#10;- Write clean code"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter each responsibility on a new line
            </p>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Qualifications <span className="text-red-500">*</span>
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="- Bachelor's degree in Computer Science&#10;- 3+ years experience&#10;- Strong problem-solving skills"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter each qualification on a new line
            </p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="React, Node.js, TypeScript, MongoDB"
            />
            <p className="text-sm text-gray-500 mt-2">
              Separate skills with commas
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center space-x-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
            >
              {saving
                ? "Saving..."
                : view === "edit"
                ? "Update Job"
                : "Post Job"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setView("list");
              }}
              className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Applicants View
  if (view === "applicants") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedJob?.title}
            </h1>
            <p className="text-gray-600 mt-1">Review and manage applicants</p>
          </div>
          <button
            onClick={() => {
              setSelectedJob(null);
              setApplicants([]);
              setView("list");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-all"
          >
            ← Back to Jobs
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-200 text-green-800"
                : "bg-red-50 border-2 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No applicants yet
            </h3>
            <p className="text-gray-600">
              Applications will appear here when candidates apply
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applicants.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl p-6 shadow-sm border-2 border-transparent hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {application.jobSeeker?.fullName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {application.jobSeeker?.fullName || "Unknown"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {application.jobSeeker?.email}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                          <span>
                            Applied {formatDate(application.appliedAt)}
                          </span>
                          <span>•</span>
                          <span
                            className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                              application.status === "pending"
                                ? "bg-blue-100 text-blue-700"
                                : application.status === "reviewing"
                                ? "bg-yellow-100 text-yellow-700"
                                : application.status === "interview"
                                ? "bg-purple-100 text-purple-700"
                                : application.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Cover Letter
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {application.resume && (
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>View Resume</span>
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 ml-6">
                    <button
                      onClick={() => handleViewCandidate(application)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center space-x-2"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>View Details</span>
                    </button>
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleUpdateApplicationStatus(
                          application._id,
                          e.target.value
                        )
                      }
                      className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Candidate Detail Modal */}
        {showCandidateModal &&
          selectedCandidate &&
          selectedCandidate.jobSeeker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                        {selectedCandidate.jobSeeker?.fullName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedCandidate.jobSeeker?.fullName || "Unknown"}
                        </h2>
                        <p className="text-indigo-100">
                          {selectedCandidate.jobSeeker?.email}
                        </p>
                        {selectedCandidate.jobSeeker?.phone && (
                          <p className="text-indigo-100">
                            📞 {selectedCandidate.jobSeeker.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={closeCandidateModal}
                      className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
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
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Application Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
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
                      Application Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Applied:</span>
                        <span className="font-semibold ml-2">
                          {formatDate(selectedCandidate.appliedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-lg font-semibold text-xs ${
                            selectedCandidate.status === "pending"
                              ? "bg-blue-100 text-blue-700"
                              : selectedCandidate.status === "reviewing"
                              ? "bg-yellow-100 text-yellow-700"
                              : selectedCandidate.status === "interview"
                              ? "bg-purple-100 text-purple-700"
                              : selectedCandidate.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedCandidate.status.charAt(0).toUpperCase() +
                            selectedCandidate.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {selectedCandidate.coverLetter && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Cover Letter
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
                        {selectedCandidate.coverLetter}
                      </div>
                    </div>
                  )}

                  {/* Resume */}
                  {selectedCandidate.jobSeeker?.resumes &&
                    selectedCandidate.jobSeeker.resumes.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Resume/CV
                        </h3>
                        <div className="space-y-2">
                          {selectedCandidate.jobSeeker.resumes.map(
                            (resume, index) => (
                              <a
                                key={index}
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-2 border-indigo-200 transition-all group"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {resume.name || `Resume ${index + 1}`}
                                    </p>
                                    {resume.uploadedAt && (
                                      <p className="text-sm text-gray-600">
                                        Uploaded {formatDate(resume.uploadedAt)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <svg
                                  className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Location */}
                  {selectedCandidate.jobSeeker?.location && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-indigo-600"
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
                        Location
                      </h3>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                        {selectedCandidate.jobSeeker.location}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedCandidate.jobSeeker?.skills &&
                    selectedCandidate.jobSeeker.skills.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.jobSeeker.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-sm"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Experience */}
                  {selectedCandidate.jobSeeker?.experiences &&
                    selectedCandidate.jobSeeker.experiences.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-indigo-600"
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
                          Work Experience
                        </h3>
                        <div className="space-y-4">
                          {selectedCandidate.jobSeeker.experiences.map(
                            (exp, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-600"
                              >
                                <h4 className="font-bold text-gray-900">
                                  {exp.title}
                                </h4>
                                <p className="text-indigo-600 font-semibold">
                                  {exp.company}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {exp.startDate} - {exp.endDate || "Present"}
                                </p>
                                {exp.description && (
                                  <p className="text-gray-700 mt-2">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Education */}
                  {selectedCandidate.jobSeeker?.education &&
                    selectedCandidate.jobSeeker.education.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                          </svg>
                          Education
                        </h3>
                        <div className="space-y-4">
                          {selectedCandidate.jobSeeker.education.map(
                            (edu, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-600"
                              >
                                <h4 className="font-bold text-gray-900">
                                  {edu.degree}
                                </h4>
                                <p className="text-purple-600 font-semibold">
                                  {edu.institution}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {edu.startDate} - {edu.endDate || "Present"}
                                </p>
                                {edu.field && (
                                  <p className="text-gray-700 mt-1">
                                    Field: {edu.field}
                                  </p>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={closeCandidateModal}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
                    >
                      Close
                    </button>
                    <div className="flex items-center space-x-3">
                      <select
                        value={selectedCandidate.status}
                        onChange={(e) => {
                          handleUpdateApplicationStatus(
                            selectedCandidate._id,
                            e.target.value
                          );
                          closeCandidateModal();
                        }}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }

  return null;
}

export default JobsNew;
