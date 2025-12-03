import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { INDUSTRIES, VIETNAM_CITIES } from "../constants";

function CompaniesPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [industries, setIndustries] = useState(["All Industries"]);
  const [locations, setLocations] = useState(["All Locations"]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [industrySearch, setIndustrySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/js/companies",
        {
          params: { limit: 100 },
        }
      );

      console.log("Companies API response:", response.data);

      // Backend returns: { success, message, data: { data: [...], pagination: {...} } }
      let companiesData =
        response.data?.data?.data || response.data?.data || response.data || [];
      console.log("Extracted companies:", companiesData);

      if (Array.isArray(companiesData) && companiesData.length > 0) {
        setCompanies(companiesData);
      }

      // Always use predefined lists from constants for consistency
      setIndustries(["All Industries", ...INDUSTRIES]);
      setLocations(["All Locations", ...VIETNAM_CITIES]);
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (error.response?.status === 429) {
        setError(
          "Too many requests. Please wait a moment and refresh the page."
        );
        console.warn("Rate limit exceeded - using mock data.");
      } else {
        setError("Failed to load companies. Showing sample data.");
      }
      // Keep companies empty to trigger mock data fallback
      // But still populate filters from mock data
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Keep mock data as fallback
  const mockCompanies = [
    {
      id: 1,
      name: "TechViet Solutions",
      description: "Leading software development company in Vietnam",
      industry: "Information Technology",
      employees: "500-1000",
      jobs: 12,
      location: "Hanoi",
      following: false,
    },
    {
      id: 2,
      name: "VinAI Research",
      description: "Leading AI research center in the region",
      industry: "AI & Machine Learning",
      employees: "100-500",
      jobs: 8,
      location: "Hanoi",
      following: true,
    },
    {
      id: 3,
      name: "Tiki Corporation",
      description: "Vietnam's largest e-commerce platform",
      industry: "E-commerce",
      employees: "1000+",
      jobs: 25,
      location: "Ho Chi Minh City",
      following: false,
    },
    {
      id: 4,
      name: "Momo E-wallet",
      description: "Digital wallet and payment solutions",
      industry: "Fintech",
      employees: "500-1000",
      jobs: 15,
      location: "Hanoi",
      following: false,
    },
    {
      id: 5,
      name: "FPT Software",
      description: "Leading technology corporation in Vietnam",
      industry: "Information Technology",
      employees: "10000+",
      jobs: 45,
      location: "Da Nang",
      following: true,
    },
    {
      id: 6,
      name: "Shopee Vietnam",
      description: "E-commerce platform",
      industry: "E-commerce",
      employees: "5000+",
      jobs: 30,
      location: "Ho Chi Minh City",
      following: false,
    },
    {
      id: 7,
      name: "VNG Corporation",
      description: "Technology and online entertainment company",
      industry: "Information Technology",
      employees: "2000+",
      jobs: 18,
      location: "Ho Chi Minh City",
      following: false,
    },
    {
      id: 8,
      name: "Viettel Group",
      description: "Telecommunications and technology corporation",
      industry: "Telecommunications",
      employees: "20000+",
      jobs: 35,
      location: "Hanoi",
      following: true,
    },
  ];

  // Use real data if available, fallback to mock
  const displayCompanies = companies.length > 0 ? companies : mockCompanies;

  const filteredCompanies = displayCompanies.filter((company) => {
    const companyName = company.companyName || company.name || "";
    const companyDesc = company.description || "";
    const companyIndustry = company.industry || "";
    const companyLocation = company.city || company.location || "";

    const matchesSearch =
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "All Industries" ||
      companyIndustry === selectedIndustry;
    const matchesLocation =
      selectedLocation === "All Locations" ||
      companyLocation === selectedLocation;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <span className="text-xl font-bold text-gray-900">
                  JobMatch
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/companies"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                >
                  Companies
                </Link>
                <Link
                  to="/employer/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  For Employers
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {authLoading ? (
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <>
                  <Link
                    to="/saved"
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                    title="Saved Jobs"
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/applications"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Applications
                        </Link>
                        <Link
                          to="/saved"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Saved Jobs
                        </Link>
                        <Link
                          to="/cv"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My CV
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}

      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Companies</h1>
            <p className="text-lg text-gray-600">Explore top employers</p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                placeholder="Search companies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Industry Dropdown */}
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowIndustryDropdown(!showIndustryDropdown);
                    setShowLocationDropdown(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <span className="text-gray-900">{selectedIndustry}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showIndustryDropdown ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showIndustryDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* Search input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          placeholder="Search industries..."
                          value={industrySearch}
                          onChange={(e) => setIndustrySearch(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="max-h-60 overflow-y-auto">
                      {industries
                        .filter((industry) =>
                          industry
                            .toLowerCase()
                            .includes(industrySearch.toLowerCase())
                        )
                        .map((industry) => (
                          <button
                            key={industry}
                            onClick={() => {
                              setSelectedIndustry(industry);
                              setShowIndustryDropdown(false);
                              setIndustrySearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors ${
                              selectedIndustry === industry
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Dropdown */}
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowLocationDropdown(!showLocationDropdown);
                    setShowIndustryDropdown(false);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-left flex items-center justify-between"
                >
                  <span className="text-gray-900">{selectedLocation}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showLocationDropdown ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showLocationDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* Search input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                          placeholder="Search locations..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="max-h-60 overflow-y-auto">
                      {locations
                        .filter((location) =>
                          location
                            .toLowerCase()
                            .includes(locationSearch.toLowerCase())
                        )
                        .map((location) => (
                          <button
                            key={location}
                            onClick={() => {
                              setSelectedLocation(location);
                              setShowLocationDropdown(false);
                              setLocationSearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors ${
                              selectedLocation === location
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {location}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backdrop to close dropdowns */}
      {(showIndustryDropdown || showLocationDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowIndustryDropdown(false);
            setShowLocationDropdown(false);
          }}
        ></div>
      )}

      {/* Companies List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-yellow-800">{error}</p>
                  </div>
                </div>
              )}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredCompanies.length} companies{" "}
                  {error && "(Sample data)"}
                </p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors">
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
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
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
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-600">No results found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCompanies.map((company) => {
                    const companyName = company.companyName || company.name;
                    const companyId = company._id || company.id;
                    const companyEmployees =
                      company.companySize ||
                      company.employees ||
                      company.size ||
                      "N/A";
                    const companyJobs = company.totalJobs || company.jobs || 0;
                    const companyLocation =
                      company.city || company.location || "N/A";

                    return (
                      <div
                        key={companyId}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform">
                            {companyName?.[0] || "C"}
                          </div>
                          <Link
                            to="/login"
                            className="p-2 rounded-lg transition-colors text-gray-400 hover:text-indigo-600 hover:bg-gray-100"
                            title="Login to follow"
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </Link>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {companyName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {company.description || "No description available"}
                        </p>

                        {company.industry && (
                          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full mb-4">
                            {company.industry}
                          </span>
                        )}

                        <div className="space-y-2 mb-4 text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
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
                            <span>{companyLocation}</span>
                          </div>
                          <div className="flex items-center space-x-2">
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
                            <span>{companyEmployees} employees</span>
                          </div>
                          <div className="flex items-center space-x-2">
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
                            <span>{companyJobs} open positions</span>
                          </div>
                        </div>

                        <Link
                          to={`/jobs?company=${companyId}`}
                          className="block w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-indigo-600 hover:text-indigo-600 transition-colors text-sm text-center"
                        >
                          View Jobs
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default CompaniesPage;
