const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
  // General Info
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  avatarUrl: {
    type: String,
    default: null
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxLength: [100, 'Location cannot exceed 100 characters']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        const age = today.getFullYear() - v.getFullYear();
        return age >= 16 && age <= 100;
      },
      message: 'Age must be between 16 and 100 years'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: [true, 'Gender is required']
  },
  dateJoining: {
    type: Date,
    default: Date.now
  },
  
  // Professional Summary
  summary: {
    type: String,
    trim: true,
    maxLength: [1000, 'Professional summary cannot exceed 1000 characters'],
    default: null
  },
  
  // Status and Activity
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
jobSeekerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
jobSeekerSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Index for search optimization
jobSeekerSchema.index({ email: 1 });
jobSeekerSchema.index({ firstName: 'text', lastName: 'text' });
jobSeekerSchema.index({ location: 1 });

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);