import { Link } from "react-router-dom";

function CandidateHome() {
  // Mock data - will be replaced with API
  const stats = [
    { label: t("home.stats.jobsAvailable"), value: "12,547", icon: "💼" },
    { label: t("home.stats.companiesHiring"), value: "3,842", icon: "🏢" },
    { label: t("home.stats.successRate"), value: "94%", icon: "✨" },
  ];

  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Vietnam",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "40000000VND - 56000000VND",
      logo: "🚀",
      matchScore: 95,
      tags: ["React", "TypeScript", "Tailwind"],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "Contract",
      salary: "35000000VND - 58000000VND",
      logo: "🎨",
      matchScore: 88,
      tags: ["Figma", "Adobe XD", "Sketch"],
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Startup Hub",
      location: "Hanoi",
      type: "Full-time",
      salary: "40000000VND - 56000000VND",
      logo: "⚡",
      matchScore: 92,
      tags: ["Node.js", "React", "MongoDB"],
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "Innovation Inc",
      location: "Hybrid",
      type: "Full-time",
      salary: "70000000VND - 115000000VND",
      logo: "📱",
      matchScore: 85,
      tags: ["Agile", "Product Strategy", "Leadership"],
      posted: "5 days ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <div className="max-w-4xl">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-sm font-medium">
              ✨ {t("home.hero.subtitle")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("home.hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {t("home.hero.description")}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 shadow-2xl">
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
                  placeholder={t("home.hero.search")}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700"
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
                  placeholder={t("home.hero.location")}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700"
                />
              </div>
              <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200">
                {t("home.hero.searchBtn")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
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
            🎯 {t("home.forYou.title")}
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "explore"
                ? "bg-primary-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🔍 {t("home.explore.title")}
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "saved"
                ? "bg-primary-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            💾 {t("home.saved.title")}
          </button>
        </div>
      </div>

      {/* API Placeholder Notice */}
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

      {/* Job Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "forYou" && t("home.forYou.title")}
              {activeTab === "explore" && t("home.explore.title")}
              {activeTab === "saved" && t("home.saved.title")}
            </h2>
            <p className="text-gray-600">
              {activeTab === "forYou" && t("home.forYou.subtitle")}
              {activeTab === "explore" && t("home.explore.subtitle")}
              {activeTab === "saved" && t("home.saved.subtitle")}
            </p>
          </div>
          <button className="px-6 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg transition-colors duration-200">
            {t("home.forYou.viewAll")} →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockJobs.map((job) => (
            <Link
              key={job.id}
              to={`/candidate/jobs/${job.id}`}
              className="card p-6 hover:border-primary-300 border-2 border-transparent transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-primary">{job.type}</span>
                <span className="badge badge-secondary">📍 {job.location}</span>
                <span className="badge badge-success">💰 {job.salary}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>🕐 {job.posted}</span>
                  <span className="flex items-center space-x-1">
                    <span>✨</span>
                    <span className="font-semibold text-primary-600">
                      {job.matchScore}% {t("job.matchScore")}
                    </span>
                  </span>
                </div>
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                  {t("job.applyNow")}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateHome;
