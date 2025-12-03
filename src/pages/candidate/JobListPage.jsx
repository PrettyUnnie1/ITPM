import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobSeekerAPI } from "../../services/api";

function JobListPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const keyword = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          keyword,
          location: location !== "Tất cả Tỉnh/Thành phố" ? location : undefined,
          page: 1,
          limit: 20,
        };

        const response = await jobSeekerAPI.searchJobs(params);

        if (response.success) {
          setJobs(response.data.data || []);
          setPagination(response.data.pagination || null);
        }
      } catch (err) {
        console.error("Fetch jobs error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, location]);

  return (
    <div className="jobs-page">
      {/* Header đơn giản, có nút quay lại Trang chủ */}
      <header className="jobs-header">
        <Link to="/" className="logo-link">
          <span className="logo-star">★</span>
          <span className="logo-text">glints</span>
        </Link>

        <div className="jobs-header-right">
          <span>Tìm được {pagination?.totalItems || 0} việc làm</span>
          <Link to="/" className="back-home">
            ← Về trang tìm kiếm
          </Link>
        </div>
      </header>

      <main className="jobs-main">
        <h1 className="jobs-title">
          Kết quả tìm kiếm
          {keyword && (
            <span className="jobs-keyword">
              {" "}
              cho từ khóa <strong>"{keyword}"</strong>
            </span>
          )}
          {location && location !== "Tất cả Tỉnh/Thành phố" && (
            <span className="jobs-location">
              {" "}
              tại <strong>{location}</strong>
            </span>
          )}
        </h1>

        {loading && <p>Đang tải danh sách việc làm...</p>}

        {error && (
          <div style={{ color: "red", padding: "1rem", background: "#fee" }}>
            ❌ Lỗi: {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p>Không tìm thấy công việc nào phù hợp.</p>
        )}

        <div className="jobs-list">
          {jobs.map((job) => (
            <article key={job._id} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-company">{job.company?.companyName || "N/A"}</p>

              <div className="job-meta">
                <span>📍 {job.location?.city || "Remote"}</span>
                <span>
                  {job.workMode === "remote"
                    ? "🌏 Remote"
                    : job.workMode === "hybrid"
                    ? "🔄 Hybrid"
                    : "🏢 Onsite"}
                </span>
                <span>💼 {job.experienceLevel || "All levels"}</span>
                <span>⏱ {job.jobType || "Full-time"}</span>
              </div>

              <p className="job-salary">
                💰{" "}
                {job.salaryRange?.min && job.salaryRange?.max
                  ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} ${
                      job.salaryRange.currency || "VND"
                    }`
                  : "Thỏa thuận"}
              </p>

              <Link
                to={`/candidate/jobs/${job._id}`}
                className="job-detail-link"
              >
                Xem chi tiết →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default JobListPage;
