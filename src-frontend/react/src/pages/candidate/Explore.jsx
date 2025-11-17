import { Link } from "react-router-dom";

function Explore() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("home.explore.title")}
        </h1>
        <p className="text-gray-600 mt-1">{t("home.explore.subtitle")}</p>
      </div>

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

      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          Explore page - Similar to Home page with all available jobs
        </p>
        <Link to="/candidate" className="btn-primary inline-block">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Explore;
