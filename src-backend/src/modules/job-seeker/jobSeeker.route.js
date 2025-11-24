const express = require('express');
const router = express.Router();
const jobSeekerController = require('./jobSeeker.controller');
const { uploadResume, handleUploadError } = require('../../middleware/upload-Middleware');
const { validateJobInterests } = require('./middleware/validation');

// Import all route modules
const jobInteractionRoutes = require('./jobInteraction.route');
const savedJobsAndCompanyRoutes = require('./savedJobsAndCompany.route');
const settingsAndNotificationsRoutes = require('./settingsAndNotifications.route');

// For now, assuming auth middleware is available
// const authMiddleware = require('../../middleware/auth-Middleware');
// router.use(authMiddleware); // Protect all routes

// SETTINGS, NOTIFICATIONS & JOB ALERTS ROUTES (Mount first)
router.use('/', settingsAndNotificationsRoutes);

// SAVED JOBS & COMPANY INTERACTION ROUTES (Mount second)
router.use('/', savedJobsAndCompanyRoutes);

// JOB INTERACTION ROUTES (Mount third)
router.use('/', jobInteractionRoutes);

// PROFILE ROUTES
// GET /js/profile - Get full profile with all nested data
router.get('/profile', jobSeekerController.getProfile);

// PATCH /js/profile/general - Update general information
router.patch('/profile/general', jobSeekerController.updateGeneralInfo);

// PUT /js/profile/summary - Update professional summary
router.put('/profile/summary', jobSeekerController.updateSummary);

// PUT /js/profile/interests - Update job interests (Upsert) with validation
router.put('/profile/interests', validateJobInterests, jobSeekerController.updateJobInterests);

// WORK EXPERIENCE ROUTES
// GET /js/profile/experiences - Get all work experiences
router.get('/profile/experiences', jobSeekerController.getWorkExperiences);

// POST /js/profile/experiences - Create new work experience
router.post('/profile/experiences', jobSeekerController.createWorkExperience);

// PUT /js/profile/experiences/:experienceId - Update work experience
router.put('/profile/experiences/:experienceId', jobSeekerController.updateWorkExperience);

// DELETE /js/profile/experiences/:experienceId - Delete work experience
router.delete('/profile/experiences/:experienceId', jobSeekerController.deleteWorkExperience);

// EDUCATION ROUTES
// GET /js/profile/education - Get all education records
router.get('/profile/education', jobSeekerController.getEducation);

// POST /js/profile/education - Create new education record
router.post('/profile/education', jobSeekerController.createEducation);

// PUT /js/profile/education/:educationId - Update education record
router.put('/profile/education/:educationId', jobSeekerController.updateEducation);

// DELETE /js/profile/education/:educationId - Delete education record
router.delete('/profile/education/:educationId', jobSeekerController.deleteEducation);

// SKILLS ROUTES
// GET /js/profile/skills - Get all skills
router.get('/profile/skills', jobSeekerController.getSkills);

// PUT /js/profile/skills - Replace all skills
router.put('/profile/skills', jobSeekerController.updateSkills);

// AWARD ROUTES
// GET /js/profile/awards - Get all awards
router.get('/profile/awards', jobSeekerController.getAwards);

// POST /js/profile/awards - Create new award
router.post('/profile/awards', jobSeekerController.createAward);

// PUT /js/profile/awards/:awardId - Update award
router.put('/profile/awards/:awardId', jobSeekerController.updateAward);

// DELETE /js/profile/awards/:awardId - Delete award
router.delete('/profile/awards/:awardId', jobSeekerController.deleteAward);

// CERTIFICATE ROUTES
// GET /js/profile/certificates - Get all certificates
router.get('/profile/certificates', jobSeekerController.getCertificates);

// POST /js/profile/certificates - Create new certificate
router.post('/profile/certificates', jobSeekerController.createCertificate);

// PUT /js/profile/certificates/:certificateId - Update certificate
router.put('/profile/certificates/:certificateId', jobSeekerController.updateCertificate);

// DELETE /js/profile/certificates/:certificateId - Delete certificate
router.delete('/profile/certificates/:certificateId', jobSeekerController.deleteCertificate);

// RESUME ROUTES
// GET /js/profile/resume - Get all resumes
router.get('/profile/resume', jobSeekerController.getResumes);

// POST /js/profile/resume - Upload new resume (with file upload middleware)
router.post('/profile/resume', uploadResume, handleUploadError, jobSeekerController.createResume);

// DELETE /js/profile/resume/:resumeId - Delete resume
router.delete('/profile/resume/:resumeId', jobSeekerController.deleteResume);

// APPLICATION MANAGEMENT ROUTES
const applicationController = require('../application/application.controller');

// GET /js/applications - Get user's job applications
router.get('/applications', applicationController.getUserApplications);

// DELETE /js/applications/:id - Withdraw job application
router.delete('/applications/:id', applicationController.withdrawApplication);

module.exports = router;