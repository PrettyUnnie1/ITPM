const { UserSettings, JobSeeker } = require('./models');
const bcrypt = require('bcrypt');

class SettingsService {

  // Get user settings (create default if not exists)
  async getUserSettings(jobSeekerId) {
    try {
      let settings = await UserSettings.findOne({ jobSeeker: jobSeekerId });
      
      if (!settings) {
        // Create default settings for new user
        settings = await UserSettings.createDefaultSettings(jobSeekerId);
        await settings.save();
      }

      return settings;
    } catch (error) {
      throw new Error(`Failed to get user settings: ${error.message}`);
    }
  }

  // Update general settings
  async updateSettings(jobSeekerId, updateData) {
    try {
      const allowedUpdates = [
        'preferences',
        'emailNotifications',
        'inAppNotifications',
        'privacy',
        'jobSearchPreferences',
        'dashboardSettings',
        'security',
        'communication',
        'dataSettings'
      ];

      // Filter update data to only include allowed fields
      const filteredUpdateData = {};
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdateData[key] = updateData[key];
        }
      });

      if (Object.keys(filteredUpdateData).length === 0) {
        throw new Error('No valid fields to update');
      }

      // Handle nested field updates
      const flattenedUpdate = {};
      Object.keys(filteredUpdateData).forEach(section => {
        if (typeof filteredUpdateData[section] === 'object' && filteredUpdateData[section] !== null) {
          Object.keys(filteredUpdateData[section]).forEach(field => {
            flattenedUpdate[`${section}.${field}`] = filteredUpdateData[section][field];
          });
        } else {
          flattenedUpdate[section] = filteredUpdateData[section];
        }
      });

      const settings = await UserSettings.findOneAndUpdate(
        { jobSeeker: jobSeekerId },
        { $set: flattenedUpdate },
        { 
          new: true, 
          runValidators: true,
          upsert: true // Create if doesn't exist
        }
      );

      return settings;
    } catch (error) {
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  }

  // Change user password
  async changePassword(jobSeekerId, oldPassword, newPassword) {
    try {
      // Get the job seeker with password field
      const jobSeeker = await JobSeeker.findById(jobSeekerId).select('+password');
      if (!jobSeeker) {
        throw new Error('User not found');
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, jobSeeker.password);
      if (!isOldPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Check if new password is different from old one
      const isSamePassword = await bcrypt.compare(newPassword, jobSeeker.password);
      if (isSamePassword) {
        throw new Error('New password must be different from current password');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await JobSeeker.findByIdAndUpdate(jobSeekerId, {
        password: hashedNewPassword,
        passwordChangedAt: new Date()
      });

      return {
        message: 'Password changed successfully',
        changedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  // Soft delete user account
  async deleteAccount(jobSeekerId, password) {
    try {
      // Get the job seeker with password field
      const jobSeeker = await JobSeeker.findById(jobSeekerId).select('+password');
      if (!jobSeeker) {
        throw new Error('User not found');
      }

      // Verify password for security
      const isPasswordValid = await bcrypt.compare(password, jobSeeker.password);
      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      // Check if account is already deleted
      if (jobSeeker.deletedAt || jobSeeker.isActive === false) {
        throw new Error('Account is already deleted');
      }

      // Perform soft delete
      const deletionDate = new Date();
      await JobSeeker.findByIdAndUpdate(jobSeekerId, {
        isActive: false,
        deletedAt: deletionDate,
        email: `deleted_${deletionDate.getTime()}_${jobSeeker.email}`, // Prevent email conflicts
        deletionReason: 'User requested account deletion'
      });

      // Optionally, you might want to:
      // 1. Cancel all active job alerts
      // 2. Mark all applications as withdrawn
      // 3. Remove saved jobs
      // 4. Unfollow all companies
      
      return {
        message: 'Account deleted successfully',
        deletedAt: deletionDate,
        recoveryPeriod: '30 days' // If you implement account recovery
      };
    } catch (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(jobSeekerId, preferences) {
    try {
      const { emailNotifications, inAppNotifications } = preferences;
      
      const updateData = {};
      if (emailNotifications) {
        Object.keys(emailNotifications).forEach(key => {
          updateData[`emailNotifications.${key}`] = emailNotifications[key];
        });
      }
      if (inAppNotifications) {
        Object.keys(inAppNotifications).forEach(key => {
          updateData[`inAppNotifications.${key}`] = inAppNotifications[key];
        });
      }

      const settings = await UserSettings.findOneAndUpdate(
        { jobSeeker: jobSeekerId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      return {
        settings,
        message: 'Notification preferences updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update notification preferences: ${error.message}`);
    }
  }

  // Update privacy settings
  async updatePrivacySettings(jobSeekerId, privacySettings) {
    try {
      const updateData = {};
      Object.keys(privacySettings).forEach(key => {
        updateData[`privacy.${key}`] = privacySettings[key];
      });

      const settings = await UserSettings.findOneAndUpdate(
        { jobSeeker: jobSeekerId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      return {
        settings,
        message: 'Privacy settings updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update privacy settings: ${error.message}`);
    }
  }

  // Get user's data export
  async exportUserData(jobSeekerId, format = 'json') {
    try {
      // Get all user data
      const [jobSeeker, settings] = await Promise.all([
        JobSeeker.findById(jobSeekerId)
          .populate('workExperiences')
          .populate('education')
          .populate('skills')
          .populate('awards')
          .populate('certificates')
          .populate('resumes')
          .populate('jobInterests')
          .lean(),
        UserSettings.findOne({ jobSeeker: jobSeekerId }).lean()
      ]);

      if (!jobSeeker) {
        throw new Error('User not found');
      }

      // Remove sensitive data
      delete jobSeeker.password;
      delete jobSeeker.__v;

      const exportData = {
        profile: jobSeeker,
        settings: settings || {},
        exportedAt: new Date(),
        format: format
      };

      // Format based on requested format
      switch (format) {
        case 'json':
          return {
            data: exportData,
            mimeType: 'application/json',
            filename: `job_seeker_data_${jobSeekerId}_${Date.now()}.json`
          };
        
        case 'csv':
          // Simple CSV export (would need proper CSV library for complex data)
          const csvData = this.convertToCSV(exportData);
          return {
            data: csvData,
            mimeType: 'text/csv',
            filename: `job_seeker_data_${jobSeekerId}_${Date.now()}.csv`
          };
        
        default:
          return {
            data: exportData,
            mimeType: 'application/json',
            filename: `job_seeker_data_${jobSeekerId}_${Date.now()}.json`
          };
      }
    } catch (error) {
      throw new Error(`Failed to export user data: ${error.message}`);
    }
  }

  // Helper method to convert object to CSV (basic implementation)
  convertToCSV(data) {
    try {
      const flattenObject = (obj, prefix = '') => {
        let flattened = {};
        for (let key in obj) {
          if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(flattened, flattenObject(obj[key], prefix + key + '_'));
          } else if (Array.isArray(obj[key])) {
            flattened[prefix + key] = obj[key].join('; ');
          } else {
            flattened[prefix + key] = obj[key];
          }
        }
        return flattened;
      };

      const flattened = flattenObject(data);
      const headers = Object.keys(flattened);
      const values = Object.values(flattened);

      return headers.join(',') + '\n' + values.map(v => 
        typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
      ).join(',');
    } catch (error) {
      throw new Error('Failed to convert data to CSV format');
    }
  }

  // Validate password strength
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength score
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    // Additional complexity
    if (password.length >= 16) score += 1;
    if (/[^A-Za-z0-9@$!%*?&]/.test(password)) score += 1;

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthIndex = Math.min(Math.floor(score / 1.5), strengthLevels.length - 1);
    
    return {
      score: score,
      level: strengthLevels[strengthIndex],
      percentage: Math.min((score / 8) * 100, 100)
    };
  }
}

module.exports = new SettingsService();