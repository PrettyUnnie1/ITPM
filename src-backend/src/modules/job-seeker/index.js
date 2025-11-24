// Job Seeker Module Exports
const jobSeekerController = require('./jobSeeker.controller');
const jobSeekerService = require('./jobSeeker.service');
const jobSeekerRoutes = require('./jobSeeker.route');
const jobInteractionController = require('./jobInteraction.controller');
const jobInteractionService = require('./jobInteraction.service');
const jobInteractionRoutes = require('./jobInteraction.route');
const savedJobsController = require('./savedJobs.controller');
const savedJobsService = require('./savedJobs.service');
const companyController = require('./company.controller');
const companyService = require('./company.service');
const savedJobsAndCompanyRoutes = require('./savedJobsAndCompany.route');
const notificationController = require('./notification.controller');
const notificationService = require('./notification.service');
const jobAlertController = require('./jobAlert.controller');
const jobAlertService = require('./jobAlert.service');
const settingsController = require('./settings.controller');
const settingsService = require('./settings.service');
const settingsAndNotificationsRoutes = require('./settingsAndNotifications.route');
const models = require('./models');

module.exports = {
  controller: jobSeekerController,
  service: jobSeekerService,
  routes: jobSeekerRoutes,
  jobInteractionController,
  jobInteractionService,
  jobInteractionRoutes,
  savedJobsController,
  savedJobsService,
  companyController,
  companyService,
  savedJobsAndCompanyRoutes,
  notificationController,
  notificationService,
  jobAlertController,
  jobAlertService,
  settingsController,
  settingsService,
  settingsAndNotificationsRoutes,
  models
};