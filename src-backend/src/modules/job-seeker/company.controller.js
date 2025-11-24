const companyService = require('./company.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class CompanyController {

  // GET /js/companies - Search companies
  async searchCompanies(req, res) {
    try {
      const searchParams = {
        name: req.query.name || '',
        location: req.query.location || '',
        industry: req.query.industry || '',
        size: req.query.size,
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const result = await companyService.searchCompanies(searchParams);

      return res.status(200).json({
        success: true,
        message: 'Companies retrieved successfully',
        data: result.companies,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/companies/:id - Get detailed company info
  async getCompanyDetails(req, res) {
    try {
      const { id: companyId } = req.params;

      if (!companyId) {
        return sendResponse(res, 400, false, 'Company ID is required');
      }

      const result = await companyService.getCompanyDetails(companyId);

      return sendResponse(res, 200, true, 'Company details retrieved successfully', result);
    } catch (error) {
      if (error.message === 'Company not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/companies/:id/follow - Follow a company
  async followCompany(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: companyId } = req.params;
      const { source } = req.body;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!companyId) {
        return sendResponse(res, 400, false, 'Company ID is required');
      }

      const follow = await companyService.followCompany(jobSeekerId, companyId, source);

      return sendResponse(res, 201, true, 'Company followed successfully', follow);
    } catch (error) {
      if (error.message === 'Company not found') {
        return sendResponse(res, 404, false, error.message);
      }
      if (error.message.includes('already following') ||
          error.message.includes('no longer active')) {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // DELETE /js/companies/:id/follow - Unfollow a company
  async unfollowCompany(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: companyId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      if (!companyId) {
        return sendResponse(res, 400, false, 'Company ID is required');
      }

      await companyService.unfollowCompany(jobSeekerId, companyId);

      return sendResponse(res, 200, true, 'Company unfollowed successfully');
    } catch (error) {
      if (error.message === 'You are not following this company') {
        return sendResponse(res, 400, false, error.message);
      }
      return sendResponse(res, 500, false, error.message);
    }
  }

  // GET /js/companies/following - Get followed companies
  async getFollowedCompanies(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await companyService.getFollowedCompanies(jobSeekerId, page, limit);

      return res.status(200).json({
        success: true,
        message: 'Followed companies retrieved successfully',
        data: result.followedCompanies,
        pagination: result.pagination
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/companies/:id/follow-status - Check if user is following company
  async checkFollowStatus(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const { id: companyId } = req.params;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      const result = await companyService.isFollowingCompany(jobSeekerId, companyId);

      return sendResponse(res, 200, true, 'Follow status retrieved', result);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/companies/:id/stats - Get company statistics
  async getCompanyStats(req, res) {
    try {
      const { id: companyId } = req.params;

      if (!companyId) {
        return sendResponse(res, 400, false, 'Company ID is required');
      }

      const stats = await companyService.getCompanyStats(companyId);

      return sendResponse(res, 200, true, 'Company statistics retrieved successfully', stats);
    } catch (error) {
      if (error.message === 'Company not found') {
        return sendResponse(res, 404, false, error.message);
      }
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/companies/trending - Get trending/popular companies
  async getTrendingCompanies(req, res) {
    try {
      const limit = req.query.limit || 10;

      const companies = await companyService.getTrendingCompanies(limit);

      return sendResponse(res, 200, true, 'Trending companies retrieved successfully', companies);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // Additional helper methods

  // GET /js/companies/suggestions - Get company suggestions based on user profile
  async getCompanySuggestions(req, res) {
    try {
      const jobSeekerId = req.user?.id;
      const limit = req.query.limit || 5;

      if (!jobSeekerId) {
        return sendResponse(res, 401, false, 'Authentication required');
      }

      // For now, return trending companies as suggestions
      // In the future, this could be enhanced with ML-based recommendations
      const companies = await companyService.getTrendingCompanies(limit);

      return sendResponse(res, 200, true, 'Company suggestions retrieved successfully', companies);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new CompanyController();