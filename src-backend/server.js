const express = require("express");
const cors = require("cors");
const jobs = require("./data/jobs.json");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// GET /api/jobs?q=&location=&page=&limit=
app.get("/api/jobs", (req, res) => {
  let { q, location, page = 1, limit = 20 } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 20;

  let filtered = jobs;

  // lọc theo keyword
  if (q && q.trim() !== "") {
    const keyword = q.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword)
    );
  }

  // lọc theo location
  if (location && location !== "Tất cả Tỉnh/Thành phố") {
    const loc = location.toLowerCase();
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(loc)
    );
  }

  const total = filtered.length;

  // phân trang
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  res.json({
    total,
    page,
    limit,
    items,
  });
});

// GET /api/jobs/:id
app.get("/api/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.json(job);
});

app.listen(PORT, () => {
  console.log(`Job API running at http://localhost:${PORT}`);
});
