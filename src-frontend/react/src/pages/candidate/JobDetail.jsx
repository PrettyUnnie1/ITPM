import { useParams, Link } from "react-router-dom";

function JobDetail() {
  // Mock data - will be replaced with API
  const job = {
    id: id,
    title: "Senior Frontend Developer",
    company: "TechCorp Vietnam",
    location: "Ho Chi Minh City, Vietnam",
    type: "Full-time",
    workMode: "Hybrid",
    salary: "$2000 - $3500",
    logo: "🚀",
    matchScore: 95,
    posted: "2 days ago",
    applicants: 47,
    description: `We are looking for a talented Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern technologies.

Key Responsibilities:
• Develop and maintain responsive web applications
• Collaborate with designers and backend developers
• Write clean, maintainable code
• Participate in code reviews
• Mentor junior developers`,
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React and TypeScript",
      "Experience with Tailwind CSS or similar frameworks",
      "Good understanding of RESTful APIs",
      "Excellent problem-solving skills",
      "Strong communication in English",
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "13th month salary",
      "Health insurance for employee and family",
      "Annual health check-up",
      "Professional development opportunities",
      "Modern office with free snacks and drinks",
      "Team building activities",
      "Flexible working hours",
    ],
    tags: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Git"],
    companyInfo: {
      name: "TechCorp Vietnam",
      employees: "200-500",
      industry: "Information Technology",
      website: "www.techcorp.vn",
    },
  };

  const similarJobs = [
    {
      id: 2,
      title: "Frontend Developer",
      company: "Digital Agency",
      salary: "$1800 - $3000",
      logo: "💻",
      matchScore: 88,
    },
    {
      id: 3,
      title: "React Developer",
      company: "Startup Hub",
      salary: "$2200 - $3800",
      logo: "⚡",
      matchScore: 92,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Link
        to="/candidate"
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
        <span className="font-medium">{t("common.back")}</span>
      </Link>

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
                  <p className="text-xl text-gray-700 mb-2">{job.company}</p>
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
                      {t("job.posted")} {job.posted}
                    </span>
                    <span>•</span>
                    <span>
                      {job.applicants} {t("job.applicants")}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSaved(!isSaved)}
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
              <span className="badge badge-primary">{job.type}</span>
              <span className="badge badge-secondary">{job.workMode}</span>
              <span className="badge badge-success">💰 {job.salary}</span>
              <span className="badge badge-warning">
                ✨ {job.matchScore}% {t("job.matchScore")}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 btn-primary">
                {t("job.applyNow")}
              </button>
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200">
                {t("job.share")}
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

          {/* Job Description */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("job.description")}
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("job.requirements")}
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
              {t("job.benefits")}
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
              {t("profile.skills")}
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
              {t("job.aboutCompany")}
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
                  <span className="text-gray-600">
                    {t("companies.employees")}
                  </span>
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
                {t("companies.viewProfile")}
              </button>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t("job.similarJobs")}
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
