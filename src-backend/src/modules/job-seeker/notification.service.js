const { Notification } = require('./models');

class NotificationService {

  // Get notifications for a user with pagination and filtering
  async getNotifications(jobSeekerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        isRead,
        priority,
        startDate,
        endDate
      } = options;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query = { jobSeeker: jobSeekerId };

      if (type) query.type = type;
      if (isRead !== undefined) query.isRead = isRead;
      if (priority) query.priority = priority;
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Execute queries
      const [notifications, totalCount, unreadCount] = await Promise.all([
        Notification.find(query)
          .sort({ priority: -1, createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Notification.countDocuments(query),
        Notification.getUnreadCount(jobSeekerId)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return {
        notifications,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalNotifications: totalCount,
          notificationsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        },
        unreadCount
      };
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  // Mark a specific notification as read
  async markAsRead(jobSeekerId, notificationId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId, 
          jobSeeker: jobSeekerId,
          isRead: false 
        },
        { 
          isRead: true, 
          readAt: new Date() 
        },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found or already read');
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(jobSeekerId) {
    try {
      const result = await Notification.markAllAsRead(jobSeekerId);
      
      return {
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} notifications marked as read`
      };
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  // Create a new notification
  async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Get notifications by type
  async getNotificationsByType(jobSeekerId, type, limit = 10) {
    try {
      const notifications = await Notification.find({
        jobSeeker: jobSeekerId,
        type: type
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      return notifications;
    } catch (error) {
      throw new Error(`Failed to get notifications by type: ${error.message}`);
    }
  }

  // Get notification statistics
  async getNotificationStats(jobSeekerId) {
    try {
      const stats = await Notification.aggregate([
        { $match: { jobSeeker: jobSeekerId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
            byType: {
              $push: {
                type: '$type',
                isRead: '$isRead',
                priority: '$priority'
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          total: 0,
          unread: 0,
          byType: {},
          byPriority: {}
        };
      }

      const { total, unread, byType } = stats[0];

      // Calculate statistics by type
      const typeStats = {};
      const priorityStats = { low: 0, medium: 0, high: 0, urgent: 0 };
      
      byType.forEach(notification => {
        if (!typeStats[notification.type]) {
          typeStats[notification.type] = { total: 0, unread: 0 };
        }
        typeStats[notification.type].total++;
        if (!notification.isRead) {
          typeStats[notification.type].unread++;
        }
        
        priorityStats[notification.priority]++;
      });

      return {
        total,
        unread,
        byType: typeStats,
        byPriority: priorityStats
      };
    } catch (error) {
      throw new Error(`Failed to get notification stats: ${error.message}`);
    }
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(daysBefore = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBefore);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true
      });

      return {
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} old notifications`
      };
    } catch (error) {
      throw new Error(`Failed to delete old notifications: ${error.message}`);
    }
  }

  // Create job alert notification
  async createJobAlertNotification(jobSeekerId, jobs, alertName) {
    try {
      if (!jobs || jobs.length === 0) return null;

      const jobCount = jobs.length;
      const title = `${jobCount} New Job${jobCount > 1 ? 's' : ''} Found`;
      const message = `Your alert "${alertName}" found ${jobCount} new job${jobCount > 1 ? 's' : ''} matching your criteria.`;

      const notification = await this.createNotification({
        jobSeeker: jobSeekerId,
        type: 'job_alert',
        title,
        message,
        priority: jobCount > 5 ? 'high' : 'medium',
        actionData: {
          actionType: 'view_jobs',
          actionUrl: '/jobs/search',
          actionText: 'View Jobs'
        },
        metadata: {
          jobCount: jobCount,
          alertName: alertName
        }
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create job alert notification: ${error.message}`);
    }
  }

  // Create application update notification
  async createApplicationUpdateNotification(jobSeekerId, application, oldStatus, newStatus) {
    try {
      const statusMessages = {
        'pending': 'Your application is under review',
        'reviewed': 'Your application has been reviewed',
        'shortlisted': 'Congratulations! You have been shortlisted',
        'interview': 'You have been invited for an interview',
        'hired': 'Congratulations! You have been hired',
        'rejected': 'Unfortunately, your application was not selected'
      };

      const title = `Application Status Update`;
      const message = statusMessages[newStatus] || `Your application status has been updated to ${newStatus}`;
      const priority = newStatus === 'hired' ? 'urgent' : newStatus === 'interview' ? 'high' : 'medium';

      const notification = await this.createNotification({
        jobSeeker: jobSeekerId,
        type: 'application_update',
        title,
        message,
        priority,
        relatedEntity: {
          entityType: 'application',
          entityId: application._id
        },
        actionData: {
          actionType: 'view_application',
          actionUrl: `/applications/${application._id}`,
          actionText: 'View Application'
        },
        metadata: {
          jobTitle: application.job?.title,
          companyName: application.job?.company?.name,
          oldStatus: oldStatus,
          newStatus: newStatus
        }
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create application update notification: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();