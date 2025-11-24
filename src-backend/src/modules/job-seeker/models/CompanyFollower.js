const mongoose = require('mongoose');

const companyFollowerSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },
  followedAt: {
    type: Date,
    default: Date.now,
    required: [true, 'Followed date is required']
  },
  
  // Notification preferences
  notifications: {
    newJobs: {
      type: Boolean,
      default: true
    },
    companyUpdates: {
      type: Boolean,
      default: false
    }
  },
  
  // Optional: Follow reason or source
  source: {
    type: String,
    enum: ['search', 'recommendation', 'job_application', 'direct_link', 'other'],
    default: 'other'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since following
companyFollowerSchema.virtual('timeFollowing').get(function() {
  const now = new Date();
  const followed = new Date(this.followedAt);
  const diffTime = Math.abs(now - followed);
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

// Compound index to prevent duplicate follows and improve query performance
companyFollowerSchema.index({ jobSeeker: 1, company: 1 }, { unique: true });

// Indexes for performance
companyFollowerSchema.index({ jobSeeker: 1, followedAt: -1 });
companyFollowerSchema.index({ company: 1, followedAt: -1 });

module.exports = mongoose.model('CompanyFollower', companyFollowerSchema);