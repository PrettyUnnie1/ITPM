// Mock application data store
const applications = [];
let applicationIdCounter = 1;

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class ApplicationController {
  
  // POST /jobs/:id/apply - Apply for a job
  async applyForJob(req, res) {
    try {
      const jobId = req.params.id;
      const userId = req.user?.id || 1;
      const { resumeId, coverLetter } = req.body;

      // Create application
      const application = {
        _id: applicationIdCounter++,
        jobId: jobId,
        userId: userId,
        resumeId: resumeId || 'default-resume',
        coverLetter: coverLetter || '',
        status: 'pending',
        appliedAt: new Date().toISOString()
      };

      applications.push(application);

      return sendResponse(res, 201, true, 'Application submitted successfully', application);
    } catch (error) {
      return sendResponse(res, 500, false, 'Failed to submit application');
    }
  }

  // GET /js/applications - Get user applications
  async getUserApplications(req, res) {
    try {
      const userId = req.user?.id || 1;
      const userApplications = applications.filter(app => app.userId === userId);

      return sendResponse(res, 200, true, 'Applications retrieved successfully', userApplications);
    } catch (error) {
      return sendResponse(res, 500, false, 'Failed to retrieve applications');
    }
  }

  // DELETE /js/applications/:id - Withdraw application
  async withdrawApplication(req, res) {
    try {
      const applicationId = parseInt(req.params.id);
      const userId = req.user?.id || 1;
      
      const applicationIndex = applications.findIndex(app => 
        app._id === applicationId && app.userId === userId
      );

      if (applicationIndex === -1) {
        return sendResponse(res, 404, false, 'Application not found');
      }

      applications.splice(applicationIndex, 1);

      return sendResponse(res, 200, true, 'Application withdrawn successfully');
    } catch (error) {
      return sendResponse(res, 500, false, 'Failed to withdraw application');
    }
  }
}

module.exports = new ApplicationController();
