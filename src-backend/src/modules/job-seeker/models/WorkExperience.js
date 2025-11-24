const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxLength: [100, 'Company name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxLength: [100, 'Position cannot exceed 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  isCurrentJob: {
    type: Boolean,
    default: function() {
      return !this.endDate;
    }
  },
  description: {
    type: String,
    trim: true,
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Additional fields
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  location: {
    type: String,
    trim: true,
    maxLength: [100, 'Location cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration
workExperienceSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth() + (years * 12);
  
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const totalYears = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${totalYears} year${totalYears !== 1 ? 's' : ''}`;
    } else {
      return `${totalYears} year${totalYears !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  }
});

// Index for performance
workExperienceSchema.index({ jobSeeker: 1, startDate: -1 });
workExperienceSchema.index({ companyName: 'text', position: 'text' });

module.exports = mongoose.model('WorkExperience', workExperienceSchema);