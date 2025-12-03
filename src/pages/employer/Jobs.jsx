import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employerAPI } from "../../services/api";

function Jobs() {
  const [view, setView] = useState("list"); // list, create, edit, applicants
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "fulltime",
    experienceLevel: "mid",
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

      // Fix: API trả về object có data property
      const jobsData = response.data?.data || response.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]); // Set empty array nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const response = await employerAPI.getJobApplicants(jobId);

      // Fix: API trả về object có data property
      const appsData = response.data?.data || response.data || [];
      setApplicants(Array.isArray(appsData) ? appsData : []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]); // Set empty array nếu lỗi
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
    const baseData = {
      title: formData.title,
      description: formData.description,
      location: {
        city: formData.location,
        country: "Vietnam",
        isRemote: formData.jobType === "remote",
      },
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      salaryRange: {
        min: parseFloat(formData.salaryMin) || 0,
        max: parseFloat(formData.salaryMax) || 0,
        currency: "USD",
      },
      requirements: formData.qualifications,
      responsibilities: formData.responsibilities,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      deadline: formData.deadline,
    };

    const isEdit = view === "edit" && selectedJob;

    const data = isEdit
      ? baseData
      : {
          ...baseData,
          status: "pending",
        };

    console.log("Submitting job data:", data);

    if (isEdit) {
      await employerAPI.updateJob(selectedJob._id, data);
      setMessage({ type: "success", text: "Job updated successfully!" });
    } else {
      const response = await employerAPI.postJob(data);
      console.log("Job post response:", response);
      setMessage({
        type: "success",
        text: "Job posted successfully! Waiting for admin approval.",
      });
    }

    await fetchJobs();
    resetForm();
    setView("list");
  } catch (error) {
    // ... phần catch giữ nguyên
  } finally {
    setSaving(false);
  }
};

  const handleEdit = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title || "",
      location: job.location?.city || job.location || "",
      jobType: job.jobType || "fulltime",
      experienceLevel: job.experienceLevel || "mid",
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
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await employerAPI.deleteJob(jobId);
      setMessage({ type: "success", text: "Job deleted successfully!" });
      await fetchJobs();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete job",
      });
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
    setView("applicants");
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await employerAPI.updateApplicationStatus(applicationId, status);
      setMessage({ type: "success", text: "Application status updated!" });
      await fetchApplicants(selectedJob._id);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      jobType: "fulltime",
      experienceLevel: "mid",
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

  // Job List View
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-600 mt-1">
              Post and manage your job listings
            </p>
          </div>
          <button
            onClick={() => setView("create")}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            + Post New Job
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start posting jobs to attract candidates
            </p>
            <button
              onClick={() => setView("create")}
              className="btn-primary inline-block"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
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
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === "open"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {job.status === "open" ? "Active" : "Closed"}
                          </span>
                          <span className="text-sm text-gray-600">
                            Posted {formatDate(job.createdAt)}
                          </span>
                          {job.deadline && (
                            <span className="text-sm text-gray-600">
                              Deadline: {formatDate(job.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewApplicants(job)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200"
                    >
                      <span className="flex items-center space-x-2">
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
                        <span>Applicants ({job.applicationsCount || 0})</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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

  // Create/Edit Job Form
  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {view === "edit" ? "Edit Job" : "Post New Job"}
            </h1>
            <p className="text-gray-600 mt-1">
              Fill in the details to post a job
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200"
          >
            ← Back to Jobs
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Ho Chi Minh City, Vietnam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Min (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 20000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Max (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 30000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Provide a detailed description of the job..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter each responsibility on a new line&#10;- Design and implement features&#10;- Collaborate with team members&#10;- Write clean, maintainable code"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter each responsibility on a new line
            </p>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications <span className="text-red-500">*</span>
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter each qualification on a new line&#10;- Bachelor's degree in Computer Science&#10;- 3+ years of experience&#10;- Strong problem-solving skills"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter each qualification on a new line
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., React, Node.js, TypeScript, MongoDB (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate skills with commas
            </p>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter each benefit on a new line&#10;- Health insurance&#10;- Remote work options&#10;- Professional development"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter each benefit on a new line
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
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
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
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
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedJob?.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage applicants for this position
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedJob(null);
              setApplicants([]);
              setView("list");
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200"
          >
            ← Back to Jobs
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : applicants.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No applicants yet
            </h3>
            <p className="text-gray-600">
              Applications will appear here when candidates apply
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((application) => (
              <div key={application._id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {application.jobSeeker?.fullName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {application.jobSeeker?.fullName ||
                            "Unknown Applicant"}
                        </h3>
                        <p className="text-gray-600">
                          {application.jobSeeker?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>Applied {formatDate(application.appliedAt)}</span>
                      <span>•</span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          application.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : application.status === "reviewing"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "interview"
                            ? "bg-purple-100 text-purple-800"
                            : application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>
                    </div>

                    {application.coverLetter && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Cover Letter
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {application.resume && (
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
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

                  <div className="flex flex-col space-y-2">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleUpdateApplicationStatus(
                          application._id,
                          e.target.value
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <Link
                      to={`/employer/applicants/${application._id}`}
                      className="px-4 py-2 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default Jobs;
