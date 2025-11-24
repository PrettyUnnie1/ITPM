const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  name: {
    type: String,
    required: [true, 'Award name is required'],
    trim: true,
    maxLength: [150, 'Award name cannot exceed 150 characters']
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
  
  // Additional fields
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'Academic Excellence',
      'Professional Achievement',
      'Innovation',
      'Leadership',
      'Community Service',
      'Research',
      'Competition',
      'Recognition',
      'Other'
    ],
    default: 'Recognition'
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
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for years since award
awardSchema.virtual('yearsSinceIssue').get(function() {
  const today = new Date();
  const issueDate = new Date(this.issueDate);
  return today.getFullYear() - issueDate.getFullYear();
});

// Index for performance
awardSchema.index({ jobSeeker: 1, issueDate: -1 });
awardSchema.index({ organization: 'text', name: 'text' });
awardSchema.index({ category: 1 });

module.exports = mongoose.model('Award', awardSchema);