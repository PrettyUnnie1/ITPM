const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required'],
    unique: true,
    index: true
  },
  
  // Language and localization
  preferences: {
    language: {
      type: String,
      enum: ['en', 'vi', 'fr', 'es', 'de'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
      validate: {
        validator: function(v) {
          // Basic timezone validation
          return /^[A-Za-z_\/]+$/.test(v);
        },
        message: 'Please enter a valid timezone'
      }
    },
    dateFormat: {
      type: String,
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      default: 'DD/MM/YYYY'
    },
    currency: {
      type: String,
      enum: ['VND', 'USD', 'EUR'],
      default: 'VND'
    }
  },
  
  // Email notification settings
  emailNotifications: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    companyUpdates: {
      type: Boolean,
      default: false
    },
    jobRecommendations: {
      type: Boolean,
      default: true
    },
    systemUpdates: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    },
    weeklyDigest: {
      type: Boolean,
      default: true
    }
  },
  
  // In-app notification settings
  inAppNotifications: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    applicationUpdates: {
      type: Boolean,
      default: true
    },
    companyUpdates: {
      type: Boolean,
      default: true
    },
    jobRecommendations: {
      type: Boolean,
      default: true
    },
    systemUpdates: {
      type: Boolean,
      default: true
    },
    soundEnabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Privacy settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'recruiters-only'],
      default: 'recruiters-only'
    },
    showOnlineStatus: {
      type: Boolean,
      default: false
    },
    allowContactFromRecruiters: {
      type: Boolean,
      default: true
    },
    showSalaryExpectations: {
      type: Boolean,
      default: false
    },
    allowProfileSearching: {
      type: Boolean,
      default: true
    }
  },
  
  // Job search preferences
  jobSearchPreferences: {
    autoApplyFilters: {
      type: Boolean,
      default: false
    },
    saveSearchHistory: {
      type: Boolean,
      default: true
    },
    showSalaryInJobList: {
      type: Boolean,
      default: true
    },
    hideAppliedJobs: {
      type: Boolean,
      default: false
    },
    jobsPerPage: {
      type: Number,
      min: [5, 'Minimum jobs per page is 5'],
      max: [50, 'Maximum jobs per page is 50'],
      default: 20
    }
  },
  
  // Dashboard and UI preferences
  dashboardSettings: {
    defaultView: {
      type: String,
      enum: ['grid', 'list', 'card'],
      default: 'list'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false
    },
    showQuickStats: {
      type: Boolean,
      default: true
    }
  },
  
  // Account security settings
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    loginNotifications: {
      type: Boolean,
      default: true
    },
    sessionTimeout: {
      type: Number, // in minutes
      min: [15, 'Minimum session timeout is 15 minutes'],
      max: [480, 'Maximum session timeout is 8 hours'],
      default: 120 // 2 hours
    }
  },
  
  // Communication preferences
  communication: {
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'in-app'],
      default: 'email'
    },
    contactTimePreference: {
      start: {
        type: String,
        default: '09:00',
        validate: {
          validator: function(v) {
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: 'Please enter a valid time format (HH:MM)'
        }
      },
      end: {
        type: String,
        default: '18:00',
        validate: {
          validator: function(v) {
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: 'Please enter a valid time format (HH:MM)'
        }
      }
    },
    allowWeekendContact: {
      type: Boolean,
      default: false
    }
  },
  
  // Data and backup preferences
  dataSettings: {
    dataRetentionPeriod: {
      type: Number, // in months
      min: [3, 'Minimum data retention is 3 months'],
      max: [60, 'Maximum data retention is 5 years'],
      default: 24 // 2 years
    },
    autoBackupEnabled: {
      type: Boolean,
      default: true
    },
    exportFormat: {
      type: String,
      enum: ['json', 'csv', 'pdf'],
      default: 'json'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting user's local time
userSettingsSchema.virtual('localTime').get(function() {
  if (this.preferences.timezone) {
    return new Date().toLocaleString('en-US', { 
      timeZone: this.preferences.timezone 
    });
  }
  return new Date().toLocaleString();
});

// Method to check if user allows contact at current time
userSettingsSchema.methods.canContactNow = function() {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = currentDay === 0 || currentDay === 6;
  
  if (isWeekend && !this.communication.allowWeekendContact) {
    return false;
  }
  
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const startTime = this.communication.contactTimePreference.start;
  const endTime = this.communication.contactTimePreference.end;
  
  return currentTime >= startTime && currentTime <= endTime;
};

// Method to get notification preferences for a specific type
userSettingsSchema.methods.getNotificationPreferences = function(notificationType) {
  const emailEnabled = this.emailNotifications[notificationType] ?? false;
  const inAppEnabled = this.inAppNotifications[notificationType] ?? false;
  
  return {
    email: emailEnabled,
    inApp: inAppEnabled,
    sound: inAppEnabled && this.inAppNotifications.soundEnabled
  };
};

// Static method to create default settings for a new user
userSettingsSchema.statics.createDefaultSettings = function(jobSeekerId) {
  return new this({
    jobSeeker: jobSeekerId,
    // All other fields will use their default values
  });
};

// Pre-save validation
userSettingsSchema.pre('save', function(next) {
  // Validate contact time range
  const startTime = this.communication.contactTimePreference.start;
  const endTime = this.communication.contactTimePreference.end;
  
  if (startTime >= endTime) {
    next(new Error('Contact start time must be before end time'));
    return;
  }
  
  next();
});

// Indexes
userSettingsSchema.index({ jobSeeker: 1 }, { unique: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);