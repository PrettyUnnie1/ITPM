const savedJobsService = require('./savedJobs.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class SavedJobsController {

  // POST /js/jobs/saved - Bookmark/save a job
  async saveJob(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { jobId, tags, notes } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!jobId) {
        return sendResponse(res, 400, false, 'Job ID is required');
      }

      const savedJob = await savedJobsService.saveJob(jobSeekerId, jobId, {
        tags: tags || [],
        notes: notes || ''
      });

      return sendResponse(res, 201, true, 'Job saved successfully', savedJob);
    } catch (error) {
      if (error.message === 'Job not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message.includes('already saved') || 
          error.message.includes('no longer available')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/jobs/saved - Get saved jobs list
  async getSavedJobs(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await savedJobsService.getSavedJobs(jobSeekerId, page, limit);

      return res.status(200).json({
        success: true,
        message: 'Saved jobs retrieved successfully',
        data: result.savedJobs,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/jobs/saved/:id - Remove job from saved list
  async unsaveJob(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: savedJobId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!savedJobId) {
        return sendResponse(res, 400, false, 'Saved job ID is required');
      }

      await savedJobsService.unsaveJob(jobSeekerId, savedJobId);

      return sendResponse(res, 200, true, 'Job removed from saved list successfully');
    } catch (error) {
      if (error.message === 'Saved job not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/jobs/:jobId/saved-status - Check if job is saved
  async checkSavedStatus(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { jobId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await savedJobsService.isJobSaved(jobSeekerId, jobId);

      return sendResponse(res, 200, true, 'Saved status retrieved', result);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/jobs/saved/tags - Get saved jobs by tags
  async getSavedJobsByTags(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { tags } = req.query; // Comma-separated tags

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
      const savedJobs = await savedJobsService.getSavedJobsByTags(jobSeekerId, tagArray);

      return sendResponse(res, 200, true, 'Saved jobs retrieved by tags successfully', savedJobs);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/jobs/saved/:id - Update saved job metadata
  async updateSavedJob(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: savedJobId } = req.params;
      const { tags, notes } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!savedJobId) {
        return sendResponse(res, 400, false, 'Saved job ID is required');
      }

      const updatedSavedJob = await savedJobsService.updateSavedJob(jobSeekerId, savedJobId, {
        tags: tags || [],
        notes: notes || ''
      });

      return sendResponse(res, 200, true, 'Saved job updated successfully', updatedSavedJob);
    } catch (error) {
      if (error.message === 'Saved job not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new SavedJobsController();