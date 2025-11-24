const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: [true, 'Job seeker reference is required']
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxLength: [50, 'Skill name cannot exceed 50 characters']
  },
  proficiencyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: [true, 'Proficiency level is required']
  },
  category: {
    type: String,
    enum: [
      'Programming Languages',
      'Web Development',
      'Mobile Development',
      'Database',
      'Cloud Computing',
      'DevOps',
      'Design',
      'Data Science',
      'Machine Learning',
      'Cybersecurity',
      'Project Management',
      'Communication',
      'Languages',
      'Other'
    ],
    required: [true, 'Skill category is required']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50'],
    default: 0
  },
  
  // Additional fields
  isFeatured: {
    type: Boolean,
    default: false
  },
  certificationUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  endorsements: {
    type: Number,
    default: 0,
    min: [0, 'Endorsements cannot be negative']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate skills per job seeker
skillSchema.index({ jobSeeker: 1, skillName: 1 }, { unique: true });

// Index for search and filtering
skillSchema.index({ category: 1, proficiencyLevel: 1 });
skillSchema.index({ skillName: 'text' });
skillSchema.index({ jobSeeker: 1, isFeatured: -1 });

module.exports = mongoose.model('Skill', skillSchema);