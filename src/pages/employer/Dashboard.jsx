import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employerAPI } from "../../services/api";

function EmployerDashboard() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch company profile
      try {
        const companyRes = await employerAPI.getMyCompanyProfile();
        setCompany(companyRes.data);
      } catch (err) {
        // Nếu 404, nghĩa là chưa có profile - không phải lỗi
        if (err.response?.status !== 404) {
          console.error("Error fetching company:", err);
        }
      }

      // Fetch jobs
      const jobsRes = await employerAPI.getMyJobs();
      const jobsData = jobsRes.data?.data || jobsRes.data || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);

      // Fetch recent applications (from first job if available)
      if (jobsData.length > 0) {
        const applicationsRes = await employerAPI.getJobApplicants(
          jobsData[0]._id
        );
        const appsData =
          applicationsRes.data?.data || applicationsRes.data || [];
        setRecentApplications(
          Array.isArray(appsData) ? appsData.slice(0, 5) : []
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "open").length,
    totalApplications: jobs.reduce(
      (sum, job) => sum + (job.totalApplications || 0),
      0
    ),
    pendingReview: recentApplications.filter((app) => app.status === "pending")
      .length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Animated Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-12 text-center">
              {/* Icon with gradient background */}
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <svg
                    className="w-12 h-12 text-white"
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
              </div>

              {/* Text Content */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to JobMatch! 🎉
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                  Create your company profile to start posting jobs and
                  attracting top talent from around the world.
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Post Jobs
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create unlimited job listings
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Find Talent
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access qualified candidates
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Track Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage applications easily
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to="/employer/company-profile"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <span>Create Company Profile</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Takes less than 5 minutes to set up
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-sm font-medium">✨ Employer Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, {company.companyName}! 👋
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Here's what's happening with your recruitment today
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/employer/jobs"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Post New Job
              </Link>
              <Link
                to="/employer/company-profile"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-lg hover:bg-white/30 transition-colors duration-200"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          {company.logoUrl && (
            <div className="hidden lg:block ml-8">
              <div className="w-32 h-32 bg-white rounded-2xl p-4 shadow-2xl">
                <img
                  src={company.logoUrl}
                  alt={company.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-indigo-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalJobs}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="text-5xl opacity-20">💼</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-green-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeJobs}
              </p>
              <p className="text-xs text-gray-500 mt-1">Currently open</p>
            </div>
            <div className="text-5xl opacity-20">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-purple-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalApplications}
              </p>
              <p className="text-xs text-gray-500 mt-1">All positions</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-yellow-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingReview}
              </p>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </div>
            <div className="text-5xl opacity-20">⏰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">
              Manage your recruitment process efficiently
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/employer/jobs"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Post New Job</h3>
              <p className="text-sm text-white/90">
                Create a new job listing to attract top talent
              </p>
            </div>
          </Link>

          <Link
            to="/employer/company-profile"
            className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Edit Profile</h3>
              <p className="text-sm text-white/90">
                Update your company information and branding
              </p>
            </div>
          </Link>

          <Link
            to="/employer/jobs"
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">View Applications</h3>
              <p className="text-sm text-white/90">
                Review and manage candidate applications
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Jobs & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
              </div>
              <p className="text-sm text-gray-600">Your latest job postings</p>
            </div>
            <Link
              to="/employer/jobs"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline"
            >
              View All →
            </Link>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <p className="text-gray-600 mb-3">No jobs posted yet</p>
              <Link
                to="/employer/jobs"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <Link
                  key={job._id}
                  to="/employer/jobs"
                  className="block p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
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
                          {job.location?.city || job.location}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{job.jobType}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {job.status === "open" ? "✓ Active" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      {job.totalApplications || 0} applicants
                    </span>
                    <span>•</span>
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Latest candidate submissions
              </p>
            </div>
            <Link
              to="/employer/jobs"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline"
            >
              View All →
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <p className="text-gray-600">No applications yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Applications will appear here when candidates apply
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {app.jobSeeker?.fullName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {app.jobSeeker?.fullName || "Applicant"}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {app.jobSeeker?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        app.status === "pending"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "reviewing"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "interview"
                          ? "bg-purple-100 text-purple-700"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
