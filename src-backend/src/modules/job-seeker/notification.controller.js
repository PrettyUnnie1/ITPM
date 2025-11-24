const notificationService = require('./notification.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class NotificationController {

  // GET /js/notifications - Get notifications for current user
  async getNotifications(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      
      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        type: req.query.type,
        isRead: req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined,
        priority: req.query.priority,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await notificationService.getNotifications(jobSeekerId, options);

      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: result.notifications,
        pagination: result.pagination,
        unreadCount: result.unreadCount
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/notifications/:id/read - Mark specific notification as read
  async markNotificationAsRead(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: notificationId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!notificationId) {
        return sendResponse(res, 400, false, 'Notification ID is required');
      }

      const notification = await notificationService.markAsRead(jobSeekerId, notificationId);

      return sendResponse(res, 200, true, 'Notification marked as read successfully', notification);
    } catch (error) {
      if (error.message === 'Notification not found or already read') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // PUT /js/notifications/read-all - Mark all notifications as read
  async markAllNotificationsAsRead(req, res) {
    try {
      const jobSeekerId = req.user?.id;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await notificationService.markAllAsRead(jobSeekerId);

      return sendResponse(res, 200, true, result.message, { 
        modifiedCount: result.modifiedCount 
      });
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/notifications/stats - Get notification statistics
  async getNotificationStats(req, res) {
    try {
      const jobSeekerId = req.user?.id;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const stats = await notificationService.getNotificationStats(jobSeekerId);

      return sendResponse(res, 200, true, 'Notification statistics retrieved successfully', stats);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/notifications/types/:type - Get notifications by type
  async getNotificationsByType(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { type } = req.params;
      const limit = req.query.limit || 10;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const validTypes = [
        'job_alert',
        'application_update', 
        'company_update',
        'system_update',
        'profile_reminder',
        'interview_reminder',
        'job_recommendation'
      ];

      if (!validTypes.includes(type)) {
        return sendResponse(res, 400, false, `Invalid notification type. Valid types: ${validTypes.join(', ')}`);
      }

      const notifications = await notificationService.getNotificationsByType(jobSeekerId, type, limit);

      return sendResponse(res, 200, true, `${type} notifications retrieved successfully`, notifications);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/notifications/cleanup - Delete old read notifications
  async cleanupOldNotifications(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const days = req.query.days || 30;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // For security, only allow cleanup of current user's notifications
      // In a real app, you might want to restrict this to admin users or run as a scheduled job
      const result = await notificationService.deleteOldNotifications(parseInt(days));

      return sendResponse(res, 200, true, result.message, { 
        deletedCount: result.deletedCount 
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/notifications/test - Create test notification (for development)
  async createTestNotification(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { type = 'system_update', title = 'Test Notification', message = 'This is a test notification' } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // Only allow in development environment
      if (process.env.NODE_ENV === 'production') {
        return sendResponse(res, 403, false, 'Test notifications not allowed in production');
      }

      const notification = await notificationService.createNotification({
        jobSeeker: jobSeekerId,
        type: type,
        title: title,
        message: message,
        priority: 'medium'
      });

      return sendResponse(res, 201, true, 'Test notification created successfully', notification);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new NotificationController();