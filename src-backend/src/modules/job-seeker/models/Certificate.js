const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  name: {
    type: String,
    required: [true, 'Certificate name is required'],
    trim: true,
    maxLength: [150, 'Certificate name cannot exceed 150 characters']
  },
  organization: {
    type: String,
    required: [true, 'Issuing organization is required'],
    trim: true,
    maxLength: [100, 'Organization name cannot exceed 100 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Issue date cannot be in the future'
    }
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > this.issueDate;
      },
      message: 'Expiry date must be after issue date'
    }
  },
  url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  
  // Additional fields
  credentialId: {
    type: String,
    trim: true,
    maxLength: [100, 'Credential ID cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  skills: [{
    type: String,
    trim: true,
    maxLength: [50, 'Skill name cannot exceed 50 characters']
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: [
      'Information Technology',
      'Project Management',
      'Marketing',
      'Finance',
      'Data Science',
      'Cloud Computing',
      'Cybersecurity',
      'Design',
      'Languages',
      'Industry Specific',
      'Other'
    ],
    default: 'Other'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for certificate status
certificateSchema.virtual('status').get(function() {
  if (!this.expiryDate) {
    return 'Valid';
  }
  
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  
  if (expiry < today) {
    return 'Expired';
  } else if (expiry.getTime() - today.getTime() <= 30 * 24 * 60 * 60 * 1000) { // 30 days
    return 'Expiring Soon';
  } else {
    return 'Valid';
  }
});

// Virtual for years since issue
certificateSchema.virtual('yearsSinceIssue').get(function() {
  const today = new Date();
  const issueDate = new Date(this.issueDate);
  return today.getFullYear() - issueDate.getFullYear();
});

// Index for performance
certificateSchema.index({ jobSeeker: 1, issueDate: -1 });
certificateSchema.index({ organization: 'text', name: 'text' });
certificateSchema.index({ category: 1, isVerified: 1 });
certificateSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);