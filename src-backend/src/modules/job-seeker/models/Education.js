const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  school: {
    type: String,
    required: [true, 'School/Institution name is required'],
    trim: true,
    maxLength: [150, 'School name cannot exceed 150 characters']
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
    maxLength: [100, 'Degree cannot exceed 100 characters']
  },
  fieldOfStudy: {
    type: String,
    trim: true,
    maxLength: [100, 'Field of study cannot exceed 100 characters']
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
  isCurrentlyStudying: {
    type: Boolean,
    default: function() {
      return !this.endDate;
    }
  },
  details: {
    type: String,
    trim: true,
    maxLength: [1000, 'Details cannot exceed 1000 characters']
  },
  
  // Additional fields
  gpa: {
    type: Number,
    min: [0, 'GPA cannot be negative'],
    max: [4.0, 'GPA cannot exceed 4.0']
  },
  degreeLevel: {
    type: String,
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Certificate', 'Diploma', 'Other'],
    required: [true, 'Degree level is required']
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
educationSchema.virtual('duration').get(function() {
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
educationSchema.index({ jobSeeker: 1, endDate: -1 });
educationSchema.index({ school: 'text', degree: 'text', fieldOfStudy: 'text' });
educationSchema.index({ degreeLevel: 1 });

module.exports = mongoose.model('Education', educationSchema);