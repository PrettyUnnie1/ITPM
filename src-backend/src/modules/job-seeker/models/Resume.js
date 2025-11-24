const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  name: {
    type: String,
    required: [true, 'Resume name is required'],
    trim: true,
    maxLength: [100, 'Resume name cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'Resume URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  
  // Additional fields
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be greater than 0']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    validate: {
      validator: function(v) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return allowedTypes.includes(v);
      },
      message: 'Only PDF, DOC, and DOCX files are allowed'
    }
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: [0, 'Download count cannot be negative']
  },
  version: {
    type: String,
    default: '1.0',
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxLength: [300, 'Description cannot exceed 300 characters']
  },
  
  // Metadata
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file size in readable format
resumeSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for file extension
resumeSchema.virtual('fileExtension').get(function() {
  const typeMap = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
  };
  return typeMap[this.fileType] || 'Unknown';
});

// Pre-save middleware to ensure only one primary resume per job seeker
resumeSchema.pre('save', async function(next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    // Set all other resumes of this job seeker to not primary
    await this.constructor.updateMany(
      { jobSeeker: this.jobSeeker, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  
  next();
});

// Index for performance
resumeSchema.index({ jobSeeker: 1, isPrimary: -1 });
resumeSchema.index({ jobSeeker: 1, uploadedAt: -1 });
resumeSchema.index({ name: 'text' });

module.exports = mongoose.model('Resume', resumeSchema);