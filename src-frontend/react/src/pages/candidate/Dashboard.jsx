import { Link } from "react-router-dom";

function Dashboard() {
  const stats = [
    {
      label: t("dashboard.stats.applied"),
      value: "24",
      icon: "📝",
      color: "from-blue-400 to-blue-600",
    },
    {
      label: t("dashboard.stats.interviews"),
      value: "5",
      icon: "📅",
      color: "from-green-400 to-green-600",
    },
    {
      label: t("dashboard.stats.offers"),
      value: "2",
      icon: "🎉",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: t("dashboard.stats.profileViews"),
      value: "148",
      icon: "👁️",
      color: "from-purple-400 to-purple-600",
    },
  ];

  const recentActivity = [
    {
      action: "Applied to Senior Frontend Developer",
      company: "TechCorp Vietnam",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Interview scheduled",
      company: "Design Studio",
      time: "1 day ago",
      status: "warning",
    },
    {
      action: "Application viewed",
      company: "Startup Hub",
      time: "2 days ago",
      status: "info",
    },
    {
      action: "Offer received",
      company: "Innovation Inc",
      time: "3 days ago",
      status: "success",
    },
  ];

  const upcomingInterviews = [
    {
      company: "TechCorp Vietnam",
      position: "Senior Frontend Developer",
      date: "Nov 18, 2025",
      time: "10:00 AM",
      type: "Video Call",
      logo: "🚀",
    },
    {
      company: "Design Studio",
      position: "UI/UX Designer",
      date: "Nov 20, 2025",
      time: "2:00 PM",
      type: "On-site",
      logo: "🎨",
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "Tech Innovators",
      matchScore: 92,
      salary: "$2500 - $4000",
      logo: "💻",
    },
    {
      id: 2,
      title: "React Developer",
      company: "Digital Solutions",
      matchScore: 88,
      salary: "$2000 - $3500",
      logo: "⚛️",
    },
    {
      id: 3,
      title: "Frontend Lead",
      company: "Creative Agency",
      matchScore: 85,
      salary: "$3000 - $5000",
      logo: "🎯",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("dashboard.welcome")}, User! 👋
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

      {/* API Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-600 mt-0.5"
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
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              API Integration Pending
            </h4>
            <p className="text-sm text-blue-700">
              {t("common.apiPlaceholder")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t("dashboard.recentActivity")}
              </h2>
              <Link
                to="/candidate/job-status"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t("common.view")} {t("nav.jobStatus")} →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
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
                    <p className="text-sm text-gray-600">{activity.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t("dashboard.recommendations")}
              </h2>
              <Link
                to="/candidate/explore"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t("home.forYou.viewAll")} →
              </Link>
            </div>
            <div className="space-y-4">
              {recommendations.map((job) => (
                <Link
                  key={job.id}
                  to={`/candidate/jobs/${job.id}`}
                  className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm font-medium text-primary-600">
                        {job.salary}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {job.matchScore}% match
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                    {t("common.view")}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("dashboard.upcomingInterviews")}
            </h2>
            <div className="space-y-4">
              {upcomingInterviews.map((interview, index) => (
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
                        {interview.position}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {interview.company}
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
                      <span>{interview.date}</span>
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{interview.time}</span>
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
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{interview.type}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                    Join Meeting
                  </button>
                </div>
              ))}
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
                <span className="font-medium text-gray-900">
                  {t("nav.cvManager")}
                </span>
              </Link>
              <Link
                to="/candidate/profile"
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">👤</span>
                <span className="font-medium text-gray-900">
                  {t("profile.edit")}
                </span>
              </Link>
              <Link
                to="/candidate/settings"
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium text-gray-900">
                  {t("nav.settings")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
