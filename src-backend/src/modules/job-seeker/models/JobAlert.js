const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Alert name is required'],
    trim: true,
    maxLength: [100, 'Alert name cannot exceed 100 characters']
  },
  
  // Search criteria
  keywords: {
    type: [String],
    default: [],
    validate: {
      validator: function(keywords) {
        return keywords.length > 0;
      },
      message: 'At least one keyword is required'
    }
  },
  location: {
    type: [String],
    default: [],
    required: [true, 'At least one location is required'],
    validate: {
      validator: function(locations) {
        return locations.length > 0;
      },
      message: 'At least one location is required'
    }
  },
  industry: {
    type: [String],
    default: []
  },
  jobType: {
    type: [String],
    enum: ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Contract', 'Internship'],
    default: []
  },
  experienceLevel: {
    type: [String],
    enum: ['Intern', 'Fresher', 'Junior', 'Senior', 'Director'],
    default: []
  },
  
  // Salary criteria
  salaryRange: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative'],
      default: null
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
      default: null
    },
    currency: {
      type: String,
      enum: ['VND', 'USD', 'EUR'],
      default: 'VND'
    }
  },
  
  // Alert settings
  frequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'daily',
    required: [true, 'Alert frequency is required']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Notification preferences
  notificationChannels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    }
  },
  
  // Alert statistics
  stats: {
    totalJobsFound: {
      type: Number,
      default: 0,
      min: [0, 'Total jobs found cannot be negative']
    },
    lastTriggered: {
      type: Date,
      default: null
    },
    lastJobFound: {
      type: Date,
      default: null
    }
  },
  
  // Advanced filters
  advancedFilters: {
    companySize: {
      type: [String],
      enum: ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)', 'Enterprise (5000+)'],
      default: []
    },
    workingSchedule: {
      type: [String],
      enum: ['Monday-Friday', 'Flexible', 'Shift-based', 'Weekend'],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    }
  },
  
  // Last execution info
  lastExecution: {
    executedAt: Date,
    jobsFound: {
      type: Number,
      default: 0
    },
    newJobsCount: {
      type: Number,
      default: 0
    },
    error: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary range
jobAlertSchema.virtual('formattedSalaryRange').get(function() {
  const { min, max, currency } = this.salaryRange;
  const formatNumber = (num) => {
    if (!num) return null;
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  if (!min && !max) return 'Any salary';
  if (min && !max) return `From ${formatNumber(min)} ${currency}`;
  if (!min && max) return `Up to ${formatNumber(max)} ${currency}`;
  return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
});

// Virtual for search criteria summary
jobAlertSchema.virtual('searchSummary').get(function() {
  const parts = [];
  
  if (this.keywords.length > 0) {
    parts.push(`Keywords: ${this.keywords.join(', ')}`);
  }
  if (this.location.length > 0) {
    parts.push(`Location: ${this.location.join(', ')}`);
  }
  if (this.industry.length > 0) {
    parts.push(`Industry: ${this.industry.join(', ')}`);
  }
  if (this.jobType.length > 0) {
    parts.push(`Type: ${this.jobType.join(', ')}`);
  }
  
  return parts.join(' | ');
});

// Validation for salary range logic
jobAlertSchema.pre('save', function(next) {
  if (this.salaryRange.min && this.salaryRange.max) {
    if (this.salaryRange.min > this.salaryRange.max) {
      next(new Error('Minimum salary cannot be greater than maximum salary'));
      return;
    }
  }
  next();
});

// Indexes for efficient querying
jobAlertSchema.index({ jobSeeker: 1, isActive: 1 });
jobAlertSchema.index({ jobSeeker: 1, frequency: 1, isActive: 1 });
jobAlertSchema.index({ keywords: 1 });
jobAlertSchema.index({ location: 1 });
jobAlertSchema.index({ industry: 1 });
jobAlertSchema.index({ 'stats.lastTriggered': 1 });
jobAlertSchema.index({ frequency: 1, isActive: 1, 'stats.lastTriggered': 1 });

// Static methods
jobAlertSchema.statics.getActiveAlerts = function(jobSeekerId) {
  return this.find({ jobSeeker: jobSeekerId, isActive: true })
    .sort({ createdAt: -1 });
};

jobAlertSchema.statics.getAlertsForExecution = function(frequency) {
  const now = new Date();
  let timeThreshold;
  
  switch (frequency) {
    case 'daily':
      timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      timeThreshold = new Date(0); // For instant alerts
  }
  
  return this.find({
    isActive: true,
    frequency: frequency,
    $or: [
      { 'stats.lastTriggered': { $exists: false } },
      { 'stats.lastTriggered': null },
      { 'stats.lastTriggered': { $lt: timeThreshold } }
    ]
  }).populate('jobSeeker', 'firstName lastName email');
};

module.exports = mongoose.model('JobAlert', jobAlertSchema);