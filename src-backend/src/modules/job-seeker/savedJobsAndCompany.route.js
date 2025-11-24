const express = require('express');
const router = express.Router();
const savedJobsController = require('./savedJobs.controller');
const companyController = require('./company.controller');
const { validateSaveJob, validateFollowCompany, validateSearchParams } = require('./middleware/validation');

// For now, assuming auth middleware is available
// const authMiddleware = require('../../middleware/auth-Middleware');
// router.use(authMiddleware); // Protect routes that need authentication

// SAVED JOBS ROUTES

// POST /js/jobs/saved - Bookmark/save a job
router.post('/jobs/saved', validateSaveJob, savedJobsController.saveJob);

// GET /js/jobs/saved - Get saved jobs list
router.get('/jobs/saved', savedJobsController.getSavedJobs);

// DELETE /js/jobs/saved/:id - Remove job from saved list
router.delete('/jobs/saved/:id', savedJobsController.unsaveJob);

// GET /js/jobs/:jobId/saved-status - Check if job is saved
router.get('/jobs/:jobId/saved-status', savedJobsController.checkSavedStatus);

// GET /js/jobs/saved/tags - Get saved jobs by tags
router.get('/jobs/saved/tags', savedJobsController.getSavedJobsByTags);

// PUT /js/jobs/saved/:id - Update saved job metadata
router.put('/jobs/saved/:id', savedJobsController.updateSavedJob);

// COMPANY DISCOVERY & FOLLOWING ROUTES

// GET /js/companies - Search companies
router.get('/companies', validateSearchParams, companyController.searchCompanies);

// GET /js/companies/trending - Get trending companies
router.get('/companies/trending', companyController.getTrendingCompanies);

// GET /js/companies/following - Get followed companies
router.get('/companies/following', companyController.getFollowedCompanies);

// GET /js/companies/suggestions - Get company suggestions
router.get('/companies/suggestions', companyController.getCompanySuggestions);

// GET /js/companies/:id - Get detailed company info
router.get('/companies/:id', companyController.getCompanyDetails);

// POST /js/companies/:id/follow - Follow a company
router.post('/companies/:id/follow', validateFollowCompany, companyController.followCompany);

// DELETE /js/companies/:id/follow - Unfollow a company
router.delete('/companies/:id/follow', companyController.unfollowCompany);

// GET /js/companies/:id/follow-status - Check if following company
router.get('/companies/:id/follow-status', companyController.checkFollowStatus);

// GET /js/companies/:id/stats - Get company statistics
router.get('/companies/:id/stats', companyController.getCompanyStats);

module.exports = router;