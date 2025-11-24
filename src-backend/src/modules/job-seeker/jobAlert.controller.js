const jobAlertService = require('./jobAlert.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class JobAlertController {

  // POST /js/alert - Create a new job alert
  async createJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const alertData = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const alert = await jobAlertService.createJobAlert(jobSeekerId, alertData);

      return sendResponse(res, 201, true, 'Job alert created successfully', alert);
    } catch (error) {
      if (error.message.includes('required')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/alert - Get all job alerts for current user
  async getJobAlerts(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const activeOnly = req.query.activeOnly === 'true';

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const alerts = await jobAlertService.getJobAlerts(jobSeekerId, activeOnly);

      return sendResponse(res, 200, true, 'Job alerts retrieved successfully', alerts);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/alert/:id - Update job alert
  async updateJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: alertId } = req.params;
      const updateData = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!alertId) {
        return sendResponse(res, 400, false, 'Alert ID is required');
      }

      const updatedAlert = await jobAlertService.updateJobAlert(jobSeekerId, alertId, updateData);

      return sendResponse(res, 200, true, 'Job alert updated successfully', updatedAlert);
    } catch (error) {
      if (error.message === 'Job alert not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message.includes('required')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // DELETE /js/alert/:id - Delete job alert
  async deleteJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: alertId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!alertId) {
        return sendResponse(res, 400, false, 'Alert ID is required');
      }

      await jobAlertService.deleteJobAlert(jobSeekerId, alertId);

      return sendResponse(res, 200, true, 'Job alert deleted successfully');
    } catch (error) {
      if (error.message === 'Job alert not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // PUT /js/alert/:id/toggle - Toggle job alert status (active/inactive)
  async toggleJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: alertId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!alertId) {
        return sendResponse(res, 400, false, 'Alert ID is required');
      }

      const result = await jobAlertService.toggleJobAlert(jobSeekerId, alertId);

      return sendResponse(res, 200, true, result.message, {
        alert: result.alert,
        status: result.status
      });
    } catch (error) {
      if (error.message === 'Job alert not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/alert/:id/test - Test job alert (find matching jobs)
  async testJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: alertId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!alertId) {
        return sendResponse(res, 400, false, 'Alert ID is required');
      }

      const result = await jobAlertService.executeJobAlert(alertId);

      return sendResponse(res, 200, true, 'Job alert test completed', {
        alertName: result.alert.name,
        matchingJobsCount: result.newJobsCount,
        matchingJobs: result.matchingJobs.slice(0, 10), // Return first 10 jobs for preview
        executedAt: result.executedAt
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('inactive')) {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/alert/stats - Get job alert statistics
  async getJobAlertStats(req, res) {
    try {
      const jobSeekerId = req.user?.id;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const stats = await jobAlertService.getAlertStatistics(jobSeekerId);

      return sendResponse(res, 200, true, 'Job alert statistics retrieved successfully', stats);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/alert/execute - Execute alerts manually (for testing/admin)
  async executeAlertsManually(req, res) {
    try {
      const { frequency = 'daily' } = req.body;

      // Only allow in development or with admin privileges
      if (process.env.NODE_ENV === 'production' && !req.user?.isAdmin) {
        return sendResponse(res, 403, false, 'Not authorized to execute alerts manually');
      }

      const validFrequencies = ['instant', 'daily', 'weekly'];
      if (!validFrequencies.includes(frequency)) {
        return sendResponse(res, 400, false, `Invalid frequency. Valid options: ${validFrequencies.join(', ')}`);
      }

      const result = await jobAlertService.executeAlertsByFrequency(frequency);

      return sendResponse(res, 200, true, 'Alerts executed successfully', result);
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/alert/:id/preview - Preview alert criteria without saving
  async previewJobAlert(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const alertCriteria = req.query; // Get criteria from query parameters

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // Create a temporary alert object for testing
      const tempAlert = {
        keywords: alertCriteria.keywords ? alertCriteria.keywords.split(',') : [],
        location: alertCriteria.location ? alertCriteria.location.split(',') : [],
        industry: alertCriteria.industry ? alertCriteria.industry.split(',') : [],
        jobType: alertCriteria.jobType ? alertCriteria.jobType.split(',') : [],
        experienceLevel: alertCriteria.experienceLevel ? alertCriteria.experienceLevel.split(',') : [],
        salaryRange: {
          min: alertCriteria.salaryMin ? parseInt(alertCriteria.salaryMin) : null,
          max: alertCriteria.salaryMax ? parseInt(alertCriteria.salaryMax) : null,
          currency: alertCriteria.currency || 'VND'
        },
        stats: { lastTriggered: null } // To get all matching jobs
      };

      const matchingJobs = await jobAlertService.searchJobsForAlert(tempAlert);

      return sendResponse(res, 200, true, 'Alert preview generated successfully', {
        matchingJobsCount: matchingJobs.length,
        previewJobs: matchingJobs.slice(0, 5), // Return first 5 jobs for preview
        criteria: tempAlert
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new JobAlertController();