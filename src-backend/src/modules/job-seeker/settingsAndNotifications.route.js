const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const jobAlertController = require('./jobAlert.controller');
const settingsController = require('./settings.controller');
const { 
  validateJobAlert, 
  validatePasswordChange, 
  validateAccountDeletion 
} = require('./middleware/validation');

// For now, assuming auth middleware is available
// const authMiddleware = require('../../middleware/auth-Middleware');
// router.use(authMiddleware); // Protect all routes with authentication

// NOTIFICATION ROUTES

// GET /js/notifications - Get notifications for current user
router.get('/notifications', notificationController.getNotifications);

// PUT /js/notifications/:id/read - Mark specific notification as read
router.put('/notifications/:id/read', notificationController.markNotificationAsRead);

// PUT /js/notifications/read-all - Mark all notifications as read
router.put('/notifications/read-all', notificationController.markAllNotificationsAsRead);

// GET /js/notifications/stats - Get notification statistics
router.get('/notifications/stats', notificationController.getNotificationStats);

// GET /js/notifications/types/:type - Get notifications by type
router.get('/notifications/types/:type', notificationController.getNotificationsByType);

// DELETE /js/notifications/cleanup - Delete old notifications
router.delete('/notifications/cleanup', notificationController.cleanupOldNotifications);

// POST /js/notifications/test - Create test notification (development only)
router.post('/notifications/test', notificationController.createTestNotification);

// JOB ALERT ROUTES

// POST /js/alert - Create new job alert
router.post('/alert', validateJobAlert, jobAlertController.createJobAlert);

// GET /js/alert - Get all job alerts for current user
router.get('/alert', jobAlertController.getJobAlerts);

// PUT /js/alert/:id - Update job alert
router.put('/alert/:id', validateJobAlert, jobAlertController.updateJobAlert);

// DELETE /js/alert/:id - Delete job alert
router.delete('/alert/:id', jobAlertController.deleteJobAlert);

// PUT /js/alert/:id/toggle - Toggle job alert status (active/inactive)
router.put('/alert/:id/toggle', jobAlertController.toggleJobAlert);

// GET /js/alert/:id/test - Test job alert (find matching jobs)
router.get('/alert/:id/test', jobAlertController.testJobAlert);

// GET /js/alert/stats - Get job alert statistics
router.get('/alert/stats', jobAlertController.getJobAlertStats);

// GET /js/alert/:id/preview - Preview alert criteria
router.get('/alert/preview', jobAlertController.previewJobAlert);

// POST /js/alert/execute - Execute alerts manually (admin/testing)
router.post('/alert/execute', jobAlertController.executeAlertsManually);

// ACCOUNT SETTINGS ROUTES

// GET /js/settings - Get current user settings
router.get('/settings', settingsController.getSettings);

// PUT /js/settings - Update general settings
router.put('/settings', settingsController.updateSettings);

// PUT /js/settings/password - Change password
router.put('/settings/password', validatePasswordChange, settingsController.changePassword);

// DELETE /js/settings/account - Delete user account (soft delete)
router.delete('/settings/account', validateAccountDeletion, settingsController.deleteAccount);

// PUT /js/settings/notifications - Update notification preferences
router.put('/settings/notifications', settingsController.updateNotificationPreferences);

// PUT /js/settings/privacy - Update privacy settings
router.put('/settings/privacy', settingsController.updatePrivacySettings);

// GET /js/settings/export - Export user data
router.get('/settings/export', settingsController.exportUserData);

// POST /js/settings/password/validate - Validate password strength
router.post('/settings/password/validate', settingsController.validatePassword);

// GET /js/settings/account-info - Get basic account information
router.get('/settings/account-info', settingsController.getAccountInfo);

// GET /js/settings/session-info - Get current session information
router.get('/settings/session-info', settingsController.getSessionInfo);

module.exports = router;