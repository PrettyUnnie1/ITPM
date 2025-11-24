import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:4000"; // backend Express

function JobListPage() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "Tất cả Tỉnh/Thành phố";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (location) params.set("location", location);
        params.set("page", 1);
        params.set("limit", 20);

        const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
        const data = await res.json();

        setJobs(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Fetch jobs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [q, location]);

  return (
    <div className="jobs-page">
      {/* Header đơn giản, có nút quay lại Trang chủ */}
      <header className="jobs-header">
        <Link to="/" className="logo-link">
          <span className="logo-star">★</span>
          <span className="logo-text">glints</span>
        </Link>

        <div className="jobs-header-right">
          <span>Tìm được {total} việc làm</span>
          <Link to="/" className="back-home">
            ← Về trang tìm kiếm
          </Link>
        </div>
      </header>

      <main className="jobs-main">
        <h1 className="jobs-title">
          Kết quả tìm kiếm
          {q && (
            <span className="jobs-keyword">
              {" "}
              cho từ khóa <strong>"{q}"</strong>
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

        {!loading && jobs.length === 0 && (
          <p>Không tìm thấy công việc nào phù hợp.</p>
        )}

        <div className="jobs-list">
          {jobs.map((job) => (
            <article key={job.id} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-company">{job.company}</p>

              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💼 {job.level}</span>
                <span>⏱ {job.type}</span>
              </div>

              <p className="job-salary">💰 {job.salary}</p>

              {/* Sau này có thể Link tới /jobs/:id */}
              {/* <Link to={`/jobs/${job.id}`} className="job-detail-link">
                Xem chi tiết →
              </Link> */}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default JobListPage;
