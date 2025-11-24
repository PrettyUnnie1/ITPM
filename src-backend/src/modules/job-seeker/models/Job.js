const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxLength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },
  // Keep legacy company name field for backward compatibility
  companyName: {
    type: String,
    trim: true,
    maxLength: [100, 'Company name cannot exceed 100 characters']
  },
  companyLogo: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxLength: [5000, 'Job description cannot exceed 5000 characters']
  },
  requirements: {
    type: String,
    trim: true,
    maxLength: [3000, 'Job requirements cannot exceed 3000 characters']
  },
  benefits: {
    type: String,
    trim: true,
    maxLength: [2000, 'Job benefits cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxLength: [100, 'Location cannot exceed 100 characters']
  },
  salaryMin: {
    type: Number,
    min: [0, 'Minimum salary cannot be negative']
  },
  salaryMax: {
    type: Number,
    min: [0, 'Maximum salary cannot be negative'],
    validate: {
      validator: function(v) {
        return !this.salaryMin || !v || v >= this.salaryMin;
      },
      message: 'Maximum salary must be greater than or equal to minimum salary'
    }
  },
  salaryCurrency: {
    type: String,
    enum: ['VND', 'USD', 'EUR'],
    default: 'VND'
  },
  category: {
    type: String,
    trim: true,
    maxLength: [50, 'Category cannot exceed 50 characters']
  },
  industry: {
    type: String,
    trim: true,
    maxLength: [50, 'Industry cannot exceed 50 characters']
  },
  level: {
    type: String,
    enum: ['Intern', 'Fresher', 'Junior', 'Senior', 'Director', 'Manager'],
    required: [true, 'Job level is required']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Contract', 'Internship'],
    required: [true, 'Job type is required']
  },
  workingHours: {
    type: String,
    trim: true,
    maxLength: [100, 'Working hours cannot exceed 100 characters']
  },
  skills: [{
    type: String,
    trim: true,
    maxLength: [50, 'Skill name cannot exceed 50 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: [0, 'Application count cannot be negative']
  },
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  
  // Company information
  companyInfo: {
    size: {
      type: String,
      enum: ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)']
    },
    website: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    address: {
      type: String,
      trim: true,
      maxLength: [200, 'Company address cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxLength: [1000, 'Company description cannot exceed 1000 characters']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary range
jobSchema.virtual('formattedSalary').get(function() {
  if (this.salaryMin && this.salaryMax) {
    return `${this.salaryMin.toLocaleString()} - ${this.salaryMax.toLocaleString()} ${this.salaryCurrency}`;
  } else if (this.salaryMin) {
    return `From ${this.salaryMin.toLocaleString()} ${this.salaryCurrency}`;
  } else if (this.salaryMax) {
    return `Up to ${this.salaryMax.toLocaleString()} ${this.salaryCurrency}`;
  }
  return 'Negotiable';
});

// Virtual for days since posted
jobSchema.virtual('daysAgo').get(function() {
  const today = new Date();
  const createdDate = new Date(this.createdAt);
  const diffTime = Math.abs(today - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Indexes for search performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ level: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ industry: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);