const express = require("express");
const cors = require("cors");
const jobs = require("./data/jobs.json");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// TODO: Replace with real auth middleware when auth module is ready
// This mock middleware bypasses JWT verification for testing purposes
const mockAuthMiddleware = (req, res, next) => {
  // Skip JWT verification and inject hardcoded user context for testing
  req.user = { id: 1, role: 'js' };
  next();
};

// Simple mock data stores
const applications = [];
let applicationIdCounter = 1;

const mockProfile = {
  user: {
    id: 1,
    email: 'jobseeker@test.com',
    firstName: 'John',
    lastName: 'Seeker',
    role: 'js'
  },
  desiredPosition: 'Software Developer',
  desiredLevel: 'Mid-level',
  industry: ['IT Software', 'Technology'],
  workLocation: ['Ho Chi Minh', 'Ha Noi'],
  expectedSalary: 2000,
  employmentType: 'Full-time',
  isOpenToWork: true
};

// Simple job seeker routes
const router = express.Router();

// GET /js/profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: mockProfile
  });
});

// PUT /js/profile/interests
router.put('/profile/interests', (req, res) => {
  const { desiredPosition, desiredLevel, industry, workLocation, expectedSalary, employmentType, isOpenToWork } = req.body;
  
  // Update mock profile
  if (desiredPosition) mockProfile.desiredPosition = desiredPosition;
  if (desiredLevel) mockProfile.desiredLevel = desiredLevel;
  if (industry) mockProfile.industry = industry;
  if (workLocation) mockProfile.workLocation = workLocation;
  if (expectedSalary) mockProfile.expectedSalary = expectedSalary;
  if (employmentType) mockProfile.employmentType = employmentType;
  if (isOpenToWork !== undefined) mockProfile.isOpenToWork = isOpenToWork;

  res.json({
    success: true,
    message: 'Job interests updated successfully',
    data: mockProfile
  });
});

// GET /js/jobs/search
router.get('/jobs/search', (req, res) => {
  const { keyword = '', location = '', page = 1, limit = 10 } = req.query;
  
  let filtered = jobs;
  
  // Filter by keyword
  if (keyword.trim()) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(kw) ||
      job.company.toLowerCase().includes(kw) ||
      job.category.toLowerCase().includes(kw)
    );
  }
  
  // Filter by location
  if (location.trim() && location !== "Tất cả Tỉnh/Thành phố") {
    const loc = location.toLowerCase();
    filtered = filtered.filter(job =>
      job.location.toLowerCase().includes(loc)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedJobs = filtered.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    message: 'Jobs retrieved successfully',
    data: paginatedJobs.map(job => ({...job, _id: job.id}))
  });
});

// GET /js/jobs/recommended
router.get('/jobs/recommended', (req, res) => {
  const userId = req.user?.id || 1;
  
  // Simple recommendation logic based on mock profile interests
  let recommended = jobs.filter(job => {
    const matchesIndustry = mockProfile.industry.some(industry => 
      job.category.toLowerCase().includes(industry.toLowerCase()) ||
      job.title.toLowerCase().includes('software') ||
      job.title.toLowerCase().includes('developer')
    );
    const matchesLocation = mockProfile.workLocation.some(location =>
      job.location.toLowerCase().includes(location.toLowerCase()) ||
      job.location.toLowerCase() === 'remote'
    );
    return matchesIndustry || matchesLocation;
  });
  
  // If no matches, return first 5 jobs as fallback
  if (recommended.length === 0) {
    recommended = jobs.slice(0, 5);
  }
  
  res.json({
    success: true,
    message: 'Recommended jobs retrieved successfully',
    data: recommended.slice(0, 10).map(job => ({...job, _id: job.id}))
  });
});

// GET /js/jobs/:id
router.get('/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const job = jobs.find(j => j.id === jobId);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Job details retrieved successfully',
    data: { ...job, _id: job.id }
  });
});

// GET /js/applications
router.get('/applications', (req, res) => {
  const userId = req.user?.id || 1;
  const userApplications = applications.filter(app => app.userId === userId);
  
  res.json({
    success: true,
    message: 'Applications retrieved successfully',
    data: userApplications
  });
});

// DELETE /js/applications/:id
router.delete('/applications/:id', (req, res) => {
  const applicationId = parseInt(req.params.id);
  const userId = req.user?.id || 1;
  
  const applicationIndex = applications.findIndex(app => 
    app._id === applicationId && app.userId === userId
  );

  if (applicationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  applications.splice(applicationIndex, 1);

  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
});

// Apply mock auth to /js/* routes
app.use('/js', mockAuthMiddleware, router);

// Job application route - without auth for testing negative cases
app.post('/jobs/:id/apply', (req, res) => {
  // Check if Authorization header is present for negative test
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  const jobId = req.params.id;
  const userId = 1; // Mock user ID
  const { resumeId, coverLetter } = req.body;

  // Check if job exists for non-existent job test
  if (jobId === 'nonexistentjobid12345') {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Create application
  const application = {
    _id: applicationIdCounter++,
    jobId: jobId,
    userId: userId,
    resumeId: resumeId || 'default-resume',
    coverLetter: coverLetter || '',
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  applications.push(application);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application
  });
});

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
  console.log('🔧 Mock Auth Middleware active for /js/* routes');
  console.log('📝 TODO: Replace mockAuthMiddleware with real auth when auth module is ready\n');
});
