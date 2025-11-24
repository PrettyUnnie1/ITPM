const express = require('express');
const router = express.Router();
const jobInteractionController = require('./jobInteraction.controller');
const { validateJobApplication, validateSearchParams } = require('./middleware/validation');

// For now, assuming auth middleware is available
// const authMiddleware = require('../../middleware/auth-Middleware');
// router.use(authMiddleware); // Protect all routes that need authentication

// JOB SEARCH AND DISCOVERY ROUTES

// GET /js/jobs/search - Search and filter jobs with pagination
router.get('/jobs/search', validateSearchParams, jobInteractionController.searchJobs);

// GET /js/jobs/recommended - Get recommended jobs based on user profile (requires auth)
router.get('/jobs/recommended', jobInteractionController.getRecommendedJobs);

// GET /js/jobs/:id - Get detailed job information
router.get('/jobs/:id', jobInteractionController.getJobDetails);

// GET /js/jobs/:id/check-application - Check if user has applied to a job (requires auth)
router.get('/jobs/:id/check-application', jobInteractionController.checkApplicationStatus);

// JOB APPLICATION ROUTES

// POST /js/jobs/:id/apply - Apply for a job (requires auth)
router.post('/jobs/:id/apply', validateJobApplication, jobInteractionController.applyForJob);

// GET /js/applications - Get list of user's applications (requires auth)
router.get('/applications', jobInteractionController.getUserApplications);

// DELETE /js/applications/:id - Withdraw application (requires auth)
router.delete('/applications/:id', jobInteractionController.withdrawApplication);

module.exports = router;