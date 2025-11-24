const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required'],
    index: true
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'job_alert',           // New job matches alert criteria
      'application_update',  // Application status changed
      'company_update',      // Followed company posted new job
      'system_update',       // System announcements
      'profile_reminder',    // Profile completion reminders
      'interview_reminder',  // Interview scheduled
      'job_recommendation'   // Personalized job recommendations
    ],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxLength: [100, 'Notification title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxLength: [500, 'Notification message cannot exceed 500 characters']
  },
  
  // Related entity references
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['job', 'application', 'company', 'system', 'profile']
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.entityType'
    }
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  
  // Priority and urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Delivery channels
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    emailSent: {
      type: Boolean,
      default: false
    }
  },
  
  // Action data (for actionable notifications)
  actionData: {
    actionType: String, // 'view_job', 'update_application', 'complete_profile'
    actionUrl: String,
    actionText: String
  },
  
  // Expiry and scheduling
  expiresAt: {
    type: Date,
    default: null
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  metadata: {
    jobTitle: String,
    companyName: String,
    location: String,
    salaryRange: String,
    alertId: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since notification
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return created.toLocaleDateString();
  }
});

// Virtual for notification category
notificationSchema.virtual('category').get(function() {
  const categoryMap = {
    'job_alert': 'Jobs',
    'application_update': 'Applications',
    'company_update': 'Companies',
    'system_update': 'System',
    'profile_reminder': 'Profile',
    'interview_reminder': 'Interviews',
    'job_recommendation': 'Recommendations'
  };
  return categoryMap[this.type] || 'General';
});

// Middleware to mark as read when readAt is set
notificationSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Compound indexes for performance
notificationSchema.index({ jobSeeker: 1, isRead: 1 });
notificationSchema.index({ jobSeeker: 1, type: 1 });
notificationSchema.index({ jobSeeker: 1, createdAt: -1 });
notificationSchema.index({ jobSeeker: 1, priority: -1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static methods
notificationSchema.statics.getUnreadCount = function(jobSeekerId) {
  return this.countDocuments({ jobSeeker: jobSeekerId, isRead: false });
};

notificationSchema.statics.markAllAsRead = function(jobSeekerId) {
  return this.updateMany(
    { jobSeeker: jobSeekerId, isRead: false },
    { 
      $set: { 
        isRead: true, 
        readAt: new Date() 
      } 
    }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);