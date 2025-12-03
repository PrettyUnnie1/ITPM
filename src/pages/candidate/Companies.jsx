import { Link } from "react-router-dom";

function Companies() {
  const companies = [
    {
      id: 1,
      name: "TechCorp Vietnam",
      logo: "🚀",
      industry: "Information Technology",
      employees: "200-500",
      location: "Ho Chi Minh City",
      openJobs: 12,
      description:
        "Leading technology company specializing in software development and IT solutions.",
      isFollowing: true,
    },
    {
      id: 2,
      name: "Design Studio",
      logo: "🎨",
      industry: "Design & Creative",
      employees: "50-100",
      location: "Remote",
      openJobs: 5,
      description:
        "Award-winning design agency creating beautiful digital experiences.",
      isFollowing: false,
    },
    {
      id: 3,
      name: "Startup Hub",
      logo: "⚡",
      industry: "Technology Startup",
      employees: "100-200",
      location: "Hanoi",
      openJobs: 8,
      description:
        "Fast-growing startup building innovative products for the future.",
      isFollowing: true,
    },
    {
      id: 4,
      name: "Innovation Inc",
      logo: "📱",
      industry: "Mobile Development",
      employees: "300-500",
      location: "Da Nang",
      openJobs: 15,
      description:
        "Mobile-first company creating apps used by millions worldwide.",
      isFollowing: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("companies.title")}
        </h1>
        <p className="text-gray-600 mt-1">{t("companies.subtitle")}</p>
      </div>

      {/* Search & Filter */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t("companies.search")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
            </div>
          </div>
          <button className="btn-outline">
            <svg
              className="w-5 h-5 inline mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {t("common.filter")}
          </button>
        </div>
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

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="card p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-3xl">
                  {company.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600">{company.industry}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  company.isFollowing
                    ? "bg-primary-50 text-primary-700 hover:bg-primary-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {company.isFollowing
                  ? t("companies.following")
                  : t("companies.follow")}
              </button>
            </div>

            <p className="text-gray-700 mb-4">{company.description}</p>

            <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  {company.employees} {t("companies.employees")}
                </span>
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>{company.location}</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-primary-600">
                  {company.openJobs}
                </span>{" "}
                {t("companies.openJobs")}
              </span>
              <Link
                to={`/candidate/companies/${company.id}`}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {t("companies.viewProfile")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Companies;
