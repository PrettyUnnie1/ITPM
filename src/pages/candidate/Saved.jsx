import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";

function Saved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.getSavedJobs({ page: 1, limit: 100 });
      // Handle paginated response
      const data = response.data?.data || response.data || [];
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
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

  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min || !salaryRange?.max) return "Negotiable";
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} VND`;
  };

  const formatDate = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600 mt-1">Jobs you've bookmarked for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No saved jobs yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start saving jobs you're interested in to review them later
          </p>
          <Link to="/candidate" className="btn-primary inline-block">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedJobs.map((item) => {
            const job = item.job;
            return (
              <div
                key={item._id}
                className="card p-6 hover:border-primary-300 border-2 border-transparent transition-all duration-200"
              >
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
                    onClick={() => handleUnsave(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove from saved"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
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

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-primary">
                    {job.jobType || "Full-time"}
                  </span>
                  <span className="badge badge-secondary">
                    📍 {job.location || "Location"}
                  </span>
                  <span className="badge badge-success">
                    💰 {formatSalary(job.salaryRange)}
                  </span>
                </div>

                {job.requirements?.skills &&
                  job.requirements.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.skills
                        .slice(0, 3)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span>Saved {formatDate(item.createdAt)}</span>
                  </div>
                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Saved;
