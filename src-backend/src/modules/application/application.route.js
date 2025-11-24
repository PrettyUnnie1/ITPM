const express = require('express');
const router = express.Router();

// Mock application data store
const applications = [];
let applicationIdCounter = 1;

// POST /jobs/:id/apply - Apply for a job
const applyForJob = (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user?.id || 1;
    const { resumeId, coverLetter } = req.body;

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

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// POST /jobs/:id/apply route
router.post('/:id/apply', applyForJob);

module.exports = router;
