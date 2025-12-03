import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch job details
        const response = await jobSeekerAPI.searchJobs({ _id: id });
        if (response.data && response.data.length > 0) {
          setJob(response.data[0]);

          // Check if job is saved
          try {
            const savedResponse = await jobSeekerAPI.getSavedJobs();
            const isSavedJob = savedResponse.data?.some(
              (saved) => saved.job?._id === id
            );
            setIsSaved(isSavedJob);
          } catch (err) {
            console.error("Error checking saved status:", err);
          }

          // Fetch similar jobs
          try {
            const similarResponse = await jobSeekerAPI.searchJobs({ limit: 3 });
            setSimilarJobs(
              similarResponse.data?.filter((j) => j._id !== id).slice(0, 3) ||
                []
            );
          } catch (err) {
            console.error("Error fetching similar jobs:", err);
          }
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");

      await jobSeekerAPI.applyForJob(id);
      alert("Application submitted successfully!");
      navigate("/candidate/job-status");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await jobSeekerAPI.unsaveJob(id);
        setIsSaved(false);
      } else {
        await jobSeekerAPI.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save job");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-neutral-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error || "Job not found"}</p>
        <Link
          to="/candidate/explore"
          className="text-brand-blue hover:underline mt-2 inline-block"
        >
          ← Back to job search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        to="/candidate/explore"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
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
        <span className="font-medium">Back to Jobs</span>
      </Link>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="card p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-3xl">
                  {job.logo}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">
                    {job.company?.name || "Company"}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-600">
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
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveToggle}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isSaved
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-100 text-gray-400 hover:text-red-500"
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

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="badge badge-primary">{job.jobType}</span>
              <span className="badge badge-secondary">
                {job.workMode === "remote"
                  ? "🌏 Remote"
                  : job.workMode === "hybrid"
                  ? "🔄 Hybrid"
                  : "🏢 Onsite"}
              </span>
              <span className="badge badge-info">{job.experienceLevel}</span>
              {job.salaryRange && (
                <span className="badge badge-success">
                  💰 {job.salaryRange.min?.toLocaleString()} -{" "}
                  {job.salaryRange.max?.toLocaleString()} VND
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
              <button
                onClick={handleSaveToggle}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Requirements
            </h2>
            <ul className="space-y-3">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-primary-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="card p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              About Company
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center text-xl">
                  {job.logo}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {job.companyInfo.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {job.companyInfo.industry}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employees</span>
                  <span className="font-semibold text-gray-900">
                    {job.companyInfo.employees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Website</span>
                  <a
                    href={`https://${job.companyInfo.website}`}
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {job.companyInfo.website}
                  </a>
                </div>
              </div>

              <button className="w-full btn-outline">
                View Company Profile
              </button>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Similar Jobs
            </h3>
            <div className="space-y-4">
              {similarJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/candidate/jobs/${job.id}`}
                  className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center text-lg">
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {job.company}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-primary-600">
                          {job.salary}
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.matchScore}% match
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
