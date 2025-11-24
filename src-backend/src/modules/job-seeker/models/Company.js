const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxLength: [100, 'Company name cannot exceed 100 characters'],
    index: true
  },
  logo: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL for logo'
    }
  },
  description: {
    type: String,
    trim: true,
    maxLength: [2000, 'Company description cannot exceed 2000 characters']
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL for website'
    }
  },
  industry: {
    type: String,
    trim: true,
    maxLength: [50, 'Industry cannot exceed 50 characters'],
    index: true
  },
  size: {
    type: String,
    enum: ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)', 'Enterprise (5000+)']
  },
  location: {
    type: String,
    required: [true, 'Company location is required'],
    trim: true,
    maxLength: [100, 'Location cannot exceed 100 characters'],
    index: true
  },
  address: {
    type: String,
    trim: true,
    maxLength: [200, 'Address cannot exceed 200 characters']
  },
  
  // Contact information
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      maxLength: [20, 'Phone number cannot exceed 20 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    }
  },
  
  // Social media links
  socialMedia: {
    linkedin: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
        },
        message: 'Please enter a valid LinkedIn URL'
      }
    },
    facebook: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
        },
        message: 'Please enter a valid Facebook URL'
      }
    }
  },
  
  // Company statistics
  stats: {
    totalJobs: {
      type: Number,
      default: 0,
      min: [0, 'Total jobs cannot be negative']
    },
    activeJobs: {
      type: Number,
      default: 0,
      min: [0, 'Active jobs cannot be negative']
    },
    totalEmployees: {
      type: Number,
      min: [1, 'Total employees must be at least 1']
    },
    followerCount: {
      type: Number,
      default: 0,
      min: [0, 'Follower count cannot be negative']
    }
  },
  
  // Company status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // SEO and additional info
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // Founded date
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year seems too old'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for company age
companySchema.virtual('age').get(function() {
  if (this.foundedYear) {
    return new Date().getFullYear() - this.foundedYear;
  }
  return null;
});

// Virtual for formatted size
companySchema.virtual('sizeCategory').get(function() {
  if (!this.size) return 'Unknown';
  return this.size.split('(')[0].trim();
});

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes for search performance
companySchema.index({ name: 'text', description: 'text', industry: 'text' });
companySchema.index({ location: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ isActive: 1, isVerified: -1 });
companySchema.index({ 'stats.activeJobs': -1 });
companySchema.index({ 'stats.followerCount': -1 });

module.exports = mongoose.model('Company', companySchema);