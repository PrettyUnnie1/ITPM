import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobSeekerAPI } from "../services/api";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await jobSeekerAPI.getCompanyDetail(id);
      console.log("Company API Response:", response);

      // API returns: { data: { info: {...}, jobs: [...] } }
      const companyData =
        response.data?.info || response.info || response.data || response;
      const jobsData = response.data?.jobs || response.jobs || [];

      console.log("Parsed Company Data:", companyData);
      console.log("Parsed Jobs Data:", jobsData);

      setCompany(companyData);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error("Error fetching company details:", error);
      setError("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min || !salaryRange?.max) return "Negotiable";
    return `${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()} VND`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 font-medium transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Company Logo */}
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.companyName}
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border border-gray-200">
                <svg
                  className="w-12 h-12 text-indigo-600"
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
            )}

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {company.companyName}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                {company.city && (
                  <div className="flex items-center gap-2">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span>{company.city}</span>
                  </div>
                )}
                {company.industry && (
                  <div className="flex items-center gap-2">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{company.industry}</span>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center gap-2">
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
                    <span>{company.companySize} employees</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-indigo-600"
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
                About Company
              </h2>
              {company.description ? (
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {company.description}
                </p>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </div>

            {/* Open Positions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-indigo-600"
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
                Open Positions
                <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {jobs.length}
                </span>
              </h2>

              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    No open positions at the moment
                  </p>
                  <p className="text-sm mt-2">
                    Check back later for new opportunities
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="block border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-indigo-300 transition-all"
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-3 hover:text-indigo-600">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
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
                          <span>{job.location?.city || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 capitalize">
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
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{job.jobType}</span>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center gap-1.5 text-green-600 font-medium">
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{formatSalary(job.salaryRange)}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills/Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Information
              </h3>
              <div className="space-y-3">
                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <span className="text-sm font-medium truncate">
                      Visit Website
                    </span>
                  </a>
                )}
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm truncate">{company.email}</span>
                  </a>
                )}
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm">{company.phone}</span>
                  </a>
                )}
                {!company.website && !company.email && !company.phone && (
                  <p className="text-gray-500 text-sm italic">
                    No contact information available
                  </p>
                )}
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Company Stats
              </h3>
              <div className="space-y-3">
                {company.foundedYear && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Founded</span>
                    <span className="font-semibold text-gray-900">
                      {company.foundedYear}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Open Jobs</span>
                  <span className="font-semibold text-indigo-600">
                    {jobs.length}
                  </span>
                </div>
                {company.companySize && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Company Size</span>
                    <span className="font-semibold text-gray-900">
                      {company.companySize}
                    </span>
                  </div>
                )}
                {company.industry && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Industry</span>
                    <span className="font-semibold text-gray-900 text-right text-sm">
                      {company.industry}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Interested in this company?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out their open positions and apply now!
              </p>
              <Link
                to="/jobs"
                className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
