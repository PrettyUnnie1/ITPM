const mongoose = require('mongoose');

const jobInterestSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  
  // Core job preferences based on UI requirements
  desiredPosition: {
    type: String,
    required: [true, 'Desired position is required'],
    trim: true,
    maxLength: [100, 'Desired position cannot exceed 100 characters'],
    examples: ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Scientist']
  },
  
  desiredLevel: {
    type: String,
    enum: ['Intern', 'Fresher', 'Junior', 'Senior', 'Director'],
    required: [true, 'Desired level is required']
  },
  
  industry: [{
    type: String,
    trim: true,
    maxLength: [50, 'Industry name cannot exceed 50 characters'],
    examples: ['IT Software', 'Marketing', 'Finance', 'Healthcare']
  }],
  
  workLocation: [{
    type: String,
    trim: true,
    maxLength: [100, 'Work location cannot exceed 100 characters'],
    examples: ['Ho Chi Minh', 'Ha Noi', 'Da Nang', 'Can Tho']
  }],
  
  expectedSalary: {
    type: Number,
    required: [true, 'Expected salary is required'],
    min: [0, 'Expected salary cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 999999999;
      },
      message: 'Expected salary must be between 0 and 999,999,999'
    }
  },
  
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Freelance'],
    required: [true, 'Employment type is required']
  },
  
  isOpenToWork: {
    type: Boolean,
    default: true,
    required: [true, 'Open to work status is required']
  },
  
  // Additional helpful fields (optional)
  salaryCurrency: {
    type: String,
    enum: ['VND', 'USD', 'EUR'],
    default: 'VND'
  },
  
  salaryPeriod: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    default: 'Monthly'
  },
  
  availableStartDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Available start date cannot be in the past'
    }
  },
  
  notes: {
    type: String,
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Validation middleware
jobInterestSchema.pre('save', function(next) {
  // Ensure at least one industry is specified
  if (!this.industry || this.industry.length === 0) {
    this.industry = ['Other'];
  }
  
  // Ensure at least one work location is specified
  if (!this.workLocation || this.workLocation.length === 0) {
    this.workLocation = ['Any Location'];
  }
  
  next();
});

// Ensure one job interest record per job seeker (One-to-One relationship)
jobInterestSchema.index({ jobSeeker: 1 }, { unique: true });

// Index for search and filtering
jobInterestSchema.index({ desiredPosition: 'text' });
jobInterestSchema.index({ desiredLevel: 1 });
jobInterestSchema.index({ industry: 1 });
jobInterestSchema.index({ workLocation: 1 });
jobInterestSchema.index({ employmentType: 1 });
jobInterestSchema.index({ isOpenToWork: 1 });
jobInterestSchema.index({ expectedSalary: 1 });

module.exports = mongoose.model('JobInterest', jobInterestSchema);