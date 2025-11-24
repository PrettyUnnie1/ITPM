const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
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
  savedAt: {
    type: Date,
    default: Date.now,
    required: [true, 'Saved date is required']
  },
  
  // Optional: Add tags or notes for organization
  tags: [{
    type: String,
    trim: true,
    maxLength: [30, 'Tag cannot exceed 30 characters']
  }],
  notes: {
    type: String,
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time since saved
savedJobSchema.virtual('timeSaved').get(function() {
  const now = new Date();
  const saved = new Date(this.savedAt);
  const diffTime = Math.abs(now - saved);
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

// Compound index to prevent duplicate saves and improve query performance
savedJobSchema.index({ jobSeeker: 1, job: 1 }, { unique: true });

// Indexes for performance
savedJobSchema.index({ jobSeeker: 1, savedAt: -1 });
savedJobSchema.index({ job: 1 });

module.exports = mongoose.model('SavedJob', savedJobSchema);