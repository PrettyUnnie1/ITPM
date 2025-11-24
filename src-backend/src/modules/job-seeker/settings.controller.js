const settingsService = require('./settings.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class SettingsController {

  // GET /js/settings - Get current user settings
  async getSettings(req, res) {
    try {
      const jobSeekerId = req.user?.id;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const settings = await settingsService.getUserSettings(jobSeekerId);

      return sendResponse(res, 200, true, 'User settings retrieved successfully', settings);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/settings - Update general settings
  async updateSettings(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const updateData = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const updatedSettings = await settingsService.updateSettings(jobSeekerId, updateData);

      return sendResponse(res, 200, true, 'Settings updated successfully', updatedSettings);
    } catch (error) {
      if (error.message === 'No valid fields to update') {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // PUT /js/settings/password - Change password
  async changePassword(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // Validate input
      if (!oldPassword || !newPassword) {
        return sendResponse(res, 400, false, 'Old password and new password are required');
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        return sendResponse(res, 400, false, 'New password and confirmation password do not match');
      }

      // Validate password strength
      const passwordValidation = settingsService.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet security requirements',
          data: {
            errors: passwordValidation.errors,
            strength: passwordValidation.strength
          }
        });
      }

      const result = await settingsService.changePassword(jobSeekerId, oldPassword, newPassword);

      return sendResponse(res, 200, true, result.message, {
        changedAt: result.changedAt,
        passwordStrength: passwordValidation.strength
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message === 'Current password is incorrect') {
        return sendResponse(res, 400, false, error.message);
      }
      if (error.message.includes('password')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // DELETE /js/settings/account - Delete user account (soft delete)
  async deleteAccount(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { password, confirmation } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!password) {
        return sendResponse(res, 400, false, 'Password is required to delete account');
      }

      if (confirmation !== 'DELETE_MY_ACCOUNT') {
        return sendResponse(res, 400, false, 'Account deletion confirmation is required. Please type "DELETE_MY_ACCOUNT" in the confirmation field');
      }

      const result = await settingsService.deleteAccount(jobSeekerId, password);

      return sendResponse(res, 200, true, result.message, {
        deletedAt: result.deletedAt,
        recoveryPeriod: result.recoveryPeriod
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message === 'Password is incorrect' || error.message === 'Account is already deleted') {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // PUT /js/settings/notifications - Update notification preferences
  async updateNotificationPreferences(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const preferences = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await settingsService.updateNotificationPreferences(jobSeekerId, preferences);

      return sendResponse(res, 200, true, result.message, result.settings);
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  }

  // PUT /js/settings/privacy - Update privacy settings
  async updatePrivacySettings(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const privacySettings = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await settingsService.updatePrivacySettings(jobSeekerId, privacySettings);

      return sendResponse(res, 200, true, result.message, result.settings);
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/settings/export - Export user data
  async exportUserData(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const format = req.query.format || 'json';

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const validFormats = ['json', 'csv'];
      if (!validFormats.includes(format)) {
        return sendResponse(res, 400, false, `Invalid format. Valid formats: ${validFormats.join(', ')}`);
      }

      const exportResult = await settingsService.exportUserData(jobSeekerId, format);

      // Set appropriate headers for file download
      res.setHeader('Content-Type', exportResult.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
      
      if (format === 'json') {
        return res.status(200).json(exportResult.data);
      } else {
        return res.status(200).send(exportResult.data);
      }
    } catch (error) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // POST /js/settings/password/validate - Validate password strength
  async validatePassword(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return sendResponse(res, 400, false, 'Password is required');
      }

      const validation = settingsService.validatePasswordStrength(password);

      return res.status(200).json({
        success: true,
        message: 'Password validation completed',
        data: {
          isValid: validation.isValid,
          errors: validation.errors,
          strength: validation.strength
        }
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/settings/account-info - Get basic account information
  async getAccountInfo(req, res) {
    try {
      const jobSeekerId = req.user?.id;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // Get basic account info (without sensitive data)
      const JobSeeker = require('./models').JobSeeker;
      const accountInfo = await JobSeeker.findById(jobSeekerId)
        .select('firstName lastName email phone location avatarUrl dateJoining isActive createdAt')
        .lean();

      if (!accountInfo) {
        return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(res, 200, true, 'Account information retrieved successfully', accountInfo);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/settings/session-info - Get current session information
  async getSessionInfo(req, res) {
    try {
      const sessionInfo = {
        userId: req.user?.id,
        loginTime: req.user?.loginTime,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        sessionDuration: req.user?.loginTime ? 
          Math.floor((Date.now() - new Date(req.user.loginTime).getTime()) / 1000 / 60) : null // in minutes
      };

      return sendResponse(res, 200, true, 'Session information retrieved successfully', sessionInfo);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new SettingsController();