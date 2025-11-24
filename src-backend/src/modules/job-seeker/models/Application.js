const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: [true, 'Resume reference is required']
  },
  coverLetter: {
    type: String,
    trim: true,
    maxLength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'pending',
    required: [true, 'Application status is required']
  },
  appliedAt: {
    type: Date,
    default: Date.now,
    required: [true, 'Applied date is required']
  },
  
  // Interview details (if applicable)
  interviewDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Interview date must be in the future'
    }
  },
  interviewLocation: {
    type: String,
    trim: true,
    maxLength: [200, 'Interview location cannot exceed 200 characters']
  },
  interviewNotes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Interview notes cannot exceed 1000 characters']
  },
  
  // Feedback from employer
  feedback: {
    type: String,
    trim: true,
    maxLength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  
  // Additional metadata
  withdrawnAt: {
    type: Date
  },
  withdrawnReason: {
    type: String,
    trim: true,
    maxLength: [500, 'Withdrawal reason cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since application
applicationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const applied = new Date(this.appliedAt);
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
});

// Virtual for status display
applicationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Review',
    'reviewed': 'Under Review',
    'interview': 'Interview Scheduled',
    'offered': 'Job Offered',
    'rejected': 'Not Selected',
    'withdrawn': 'Withdrawn'
  };
  return statusMap[this.status] || this.status;
});

// Compound index to prevent duplicate applications
applicationSchema.index({ jobSeeker: 1, job: 1 }, { unique: true });

// Indexes for performance
applicationSchema.index({ jobSeeker: 1, appliedAt: -1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ status: 1, appliedAt: -1 });

// Pre-save middleware to set withdrawnAt when status changes to withdrawn
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'withdrawn' && !this.withdrawnAt) {
    this.withdrawnAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);