import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jobSeekerAPI } from "../../services/api";

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch profile data
        const profileData = await jobSeekerAPI.getMyProfile();
        setProfile(profileData.data);

        // Fetch applications
        const applicationsData = await jobSeekerAPI.getMyApplications();
        setApplications(applicationsData.data || []);

        // Fetch recommended jobs
        const recommendedData = await jobSeekerAPI.getRecommendedJobs();
        setRecommendedJobs(recommendedData.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats from applications
  const calculateStats = () => {
    const applied = applications.length;
    const interviews = applications.filter(
      (app) => app.status === "interview" || app.status === "reviewing"
    ).length;
    const offers = applications.filter(
      (app) => app.status === "accepted"
    ).length;
    const profileViews = profile?.views || 0;

    return { applied, interviews, offers, profileViews };
  };

  const stats = loading
    ? []
    : [
        {
          label: "Applied Jobs",
          value: calculateStats().applied,
          icon: "📝",
          color: "from-blue-400 to-blue-600",
        },
        {
          label: "Interviews",
          value: calculateStats().interviews,
          icon: "📅",
          color: "from-green-400 to-green-600",
        },
        {
          label: "Offers",
          value: calculateStats().offers,
          icon: "🎉",
          color: "from-yellow-400 to-yellow-600",
        },
        {
          label: "Profile Views",
          value: calculateStats().profileViews,
          icon: "👁️",
          color: "from-purple-400 to-purple-600",
        },
      ];

  // Get recent applications as activity
  const recentActivity = applications
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 4)
    .map((app) => ({
      action: `Applied to ${app.job?.title || "Job"}`,
      company: app.job?.company?.name || "Company",
      time: formatDate(app.appliedAt),
      status:
        app.status === "accepted"
          ? "success"
          : app.status === "interview"
          ? "warning"
          : "info",
    }));

  // Get upcoming interviews
  const upcomingInterviews = applications
    .filter((app) => app.status === "interview")
    .slice(0, 2);

  // Format date helper
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-neutral-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {profile?.fullName || user?.fullName || "User"}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <Link
                to="/candidate/job-status"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Job Status →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.company}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recommended Jobs
              </h2>
              <Link
                to="/candidate/explore"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedJobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recommendations yet
                </p>
              ) : (
                recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/candidate/jobs/${job.id}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-2xl">
                      💼
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {job.company?.name || "Company"}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-sm font-medium text-primary-600">
                          {job.salary
                            ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} VND`
                            : "Negotiable"}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {job.location}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                      View
                    </button>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Upcoming Interviews
            </h2>
            <div className="space-y-4">
              {upcomingInterviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No upcoming interviews
                </p>
              ) : (
                upcomingInterviews.map((interview, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center text-lg">
                        {interview.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {interview.job?.title || "Interview"}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {interview.job?.company?.name || "Company"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(interview.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="capitalize">{interview.status}</span>
                      </div>
                    </div>
                    <Link
                      to={`/candidate/jobs/${interview.job?._id}`}
                      className="w-full mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/candidate/cv-manager"
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">📄</span>
                <span className="font-medium text-gray-900">CV Manager</span>
              </Link>
              <Link
                to="/candidate/profile"
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">👤</span>
                <span className="font-medium text-gray-900">Edit Profile</span>
              </Link>
              <Link
                to="/candidate/settings"
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium text-gray-900">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
