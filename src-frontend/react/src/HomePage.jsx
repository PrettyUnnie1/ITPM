import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();

  // Dùng keyword/location giống main để BE hiểu
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Tất cả Tỉnh/Thành phố");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim() !== "") params.set("q", keyword.trim());
    if (location) params.set("location", location);

    navigate(`/jobs?${params.toString()}`);
  };

  // Mock job data (UI của branch bạn)
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechViet Solutions",
      location: "Hanoi",
      type: "Full-time",
      salary: "$2,000 - $3,000",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      saved: false,
    },
    {
      id: 2,
      title: "AI/ML Engineer",
      company: "VinAI Research",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$2,500 - $4,000",
      posted: "1 day ago",
      tags: ["Python", "TensorFlow", "PyTorch"],
      saved: true,
    },
    {
      id: 3,
      title: "Product Designer",
      company: "Tiki Corporation",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$1,800 - $2,500",
      posted: "3 days ago",
      tags: ["Figma", "UI/UX", "Design System"],
      saved: false,
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "Momo E-wallet",
      location: "Hanoi",
      type: "Full-time",
      salary: "$2,000 - $3,000",
      posted: "1 week ago",
      tags: ["Node.js", "MongoDB", "Microservices"],
      saved: false,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "FPT Software",
      location: "Da Nang",
      type: "Full-time",
      salary: "$2,200 - $3,500",
      posted: "4 days ago",
      tags: ["AWS", "Docker", "Kubernetes"],
      saved: false,
    },
    {
      id: 6,
      title: "Data Analyst",
      company: "Shopee Vietnam",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$1,500 - $2,300",
      posted: "5 days ago",
      tags: ["SQL", "Python", "Power BI"],
      saved: false,
    },
  ];

  // Mock company data
  const companies = [
    {
      id: 1,
      name: "TechViet Solutions",
      description: "Leading software development company in Vietnam",
      industry: "Information Technology",
      employees: "500-1000 employees",
      jobs: 12,
      location: "Hanoi",
    },
    {
      id: 2,
      name: "VinAI Research",
      description: "Leading AI research center in the region",
      industry: "AI & Machine Learning",
      employees: "100-500 employees",
      jobs: 8,
      location: "Hanoi",
    },
    {
      id: 3,
      name: "Tiki Corporation",
      description: "Vietnam's largest e-commerce platform",
      industry: "E-commerce",
      employees: "1000+ employees",
      jobs: 25,
      location: "Ho Chi Minh City",
    },
    {
      id: 4,
      name: "Momo E-wallet",
      description: "Digital wallet and payment solutions",
      industry: "Fintech",
      employees: "500-1000 employees",
      jobs: 15,
      location: "Hanoi, HCMC",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
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
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  to="/companies"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Companies
                </Link>
                <Link
                  to="#"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <Link
                to="/candidate/login"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm font-medium text-indigo-600">
                Find jobs with AI
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover thousands of job opportunities that match your skills
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  placeholder="Search jobs, positions..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                {/* UI vẫn là input text, nhưng state/location & handleSearch dùng logic của main */}
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs For You Section */}
      {/* (phần dưới giữ nguyên UI của bạn) */}
      {/* ... PHẦN JOBS + COMPANIES + CTA giống hệt code bạn gửi trước ... */}
      {/* Ở đây mình rút ngắn, nhưng khi bạn dùng thì giữ nguyên phần Jobs/Companies/CTA như bản Tailwind của bạn */}
      
      {/* Jobs For You Section */}
      <section className="py-12 bg-white">
        {/* ... NGUYÊN ĐOẠN JOBS Y NHƯ BẠN ĐANG CÓ ... */}
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-12 bg-gray-50">
        {/* ... NGUYÊN ĐOẠN COMPANIES Y NHƯ BẠN ĐANG CÓ ... */}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        {/* ... NGUYÊN ĐOẠN CTA Y NHƯ BẠN ĐANG CÓ ... */}
      </section>
    </div>
  );
}

export default HomePage;
