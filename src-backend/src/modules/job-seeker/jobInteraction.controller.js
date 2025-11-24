const jobInteractionService = require('./jobInteraction.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class JobInteractionController {

  // GET /js/jobs/search - Search and filter jobs
  async searchJobs(req, res) {
    try {
      const searchParams = {
        keyword: req.query.keyword || '',
        location: req.query.location || '',
        salaryMin: req.query.salaryMin,
        salaryMax: req.query.salaryMax,
        jobType: req.query.jobType,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await jobInteractionService.searchJobs(searchParams);

      return res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: result.jobs,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/jobs/recommended - Get recommended jobs based on user profile
  async getRecommendedJobs(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.userId;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await jobInteractionService.getRecommendedJobs(jobSeekerId, page, limit);

      return res.status(200).json({
        success: true,
        message: 'Recommended jobs retrieved successfully',
        data: result.jobs,
        matchingCriteria: result.matchingCriteria,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/jobs/:id - Get detailed job information
  async getJobDetails(req, res) {
    try {
      const { id: jobId } = req.params;

      if (!jobId) {
        return sendResponse(res, 400, false, 'Job ID is required');
      }

      const job = await jobInteractionService.getJobDetails(jobId);

      return sendResponse(res, 200, true, 'Job details retrieved successfully', job);
    } catch (error) {
      if (error.message === 'Job not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/jobs/:id/apply - Apply for a job
  async applyForJob(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: jobId } = req.params;
      const { resumeId, coverLetter } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!jobId) {
        return sendResponse(res, 400, false, 'Job ID is required');
      }

      if (!resumeId) {
        return sendResponse(res, 400, false, 'Resume ID is required');
      }

      const application = await jobInteractionService.applyForJob(
        jobSeekerId,
        jobId,
        { resumeId, coverLetter }
      );

      return sendResponse(res, 201, true, 'Application submitted successfully', application);
    } catch (error) {
      if (error.message === 'Job not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message.includes('already applied') || 
          error.message.includes('Resume not found') ||
          error.message.includes('deadline has passed') ||
          error.message.includes('no longer available')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/applications - Get list of applied jobs
  async getUserApplications(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await jobInteractionService.getUserApplications(jobSeekerId, page, limit);

      return res.status(200).json({
        success: true,
        message: 'Applications retrieved successfully',
        data: result.applications,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/applications/:id - Withdraw application
  async withdrawApplication(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: applicationId } = req.params;
      const { reason } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!applicationId) {
        return sendResponse(res, 400, false, 'Application ID is required');
      }

      const application = await jobInteractionService.withdrawApplication(
        jobSeekerId,
        applicationId,
        reason
      );

      return sendResponse(res, 200, true, 'Application withdrawn successfully', application);
    } catch (error) {
      if (error.message === 'Application not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message.includes('Cannot withdraw application')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // Additional helper endpoints

  // GET /js/jobs/:id/check-application - Check if user has applied to a job
  async checkApplicationStatus(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: jobId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const { Application } = require('./models');
      const application = await Application.findOne({
        jobSeeker: jobSeekerId,
        job: jobId
      }).select('status appliedAt');

      if (application) {
        return sendResponse(res, 200, true, 'Application status retrieved', {
          hasApplied: true,
          status: application.status,
          appliedAt: application.appliedAt
        });
      } else {
        return sendResponse(res, 200, true, 'No application found', {
          hasApplied: false
        });
      }
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new JobInteractionController();