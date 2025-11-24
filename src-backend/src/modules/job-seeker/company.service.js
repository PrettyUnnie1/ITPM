const { Company, CompanyFollower, Job } = require('./models');

class CompanyService {

  // Search companies with filters
  async searchCompanies(searchParams) {
    try {
      const { 
        name = '', 
        location = '', 
        industry = '',
        size,
        page = 1, 
        limit = 20 
      } = searchParams;

      // Build query object
      const query = { isActive: true };
      
      // Name search
      if (name.trim()) {
        query.$text = { $search: name.trim() };
      }
      
      // Location filter
      if (location.trim()) {
        query.location = { $regex: location.trim(), $options: 'i' };
      }
      
      // Industry filter
      if (industry.trim()) {
        query.industry = { $regex: industry.trim(), $options: 'i' };
      }

      // Company size filter
      if (size) {
        query.size = size;
      }

      // Calculate pagination
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit))); // Max 50 per page
      const skip = (pageNum - 1) * limitNum;

      // Execute query with pagination
      const [companies, totalCount] = await Promise.all([
        Company.find(query)
          .select('name logo description industry location size stats.activeJobs stats.followerCount isVerified')
          .sort({ 'stats.followerCount': -1, isVerified: -1, name: 1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Company.countDocuments(query)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return {
        companies,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCompanies: totalCount,
          companiesPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw new Error(`Failed to search companies: ${error.message}`);
    }
  }

  // Get detailed company information with active jobs
  async getCompanyDetails(companyId) {
    try {
      const company = await Company.findById(companyId);
      
      if (!company) {
        throw new Error('Company not found');
      }

      if (!company.isActive) {
        throw new Error('This company profile is no longer available');
      }

      // Get active jobs for this company
      const activeJobs = await Job.find({ 
        company: companyId, 
        isActive: true 
      })
        .select('title location salaryMin salaryMax salaryCurrency type level createdAt applicationDeadline applicationCount')
        .sort({ createdAt: -1 })
        .limit(20) // Limit to latest 20 jobs
        .lean();

      return {
        company,
        activeJobs,
        jobCount: activeJobs.length
      };
    } catch (error) {
      throw new Error(`Failed to get company details: ${error.message}`);
    }
  }

  // Follow a company
  async followCompany(jobSeekerId, companyId, source = 'other') {
    try {
      // Check if company exists and is active
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      if (!company.isActive) {
        throw new Error('This company is no longer active');
      }

      // Check if user is already following this company
      const existingFollow = await CompanyFollower.findOne({
        jobSeeker: jobSeekerId,
        company: companyId
      });

      if (existingFollow) {
        throw new Error('You are already following this company');
      }

      // Create follow record
      const follow = new CompanyFollower({
        jobSeeker: jobSeekerId,
        company: companyId,
        source: source
      });

      await follow.save();

      // Increment company follower count
      await Company.findByIdAndUpdate(companyId, { 
        $inc: { 'stats.followerCount': 1 } 
      });

      // Return follow record with populated company data
      const populatedFollow = await CompanyFollower.findById(follow._id)
        .populate('company', 'name logo industry location stats.activeJobs');

      return populatedFollow;
    } catch (error) {
      throw new Error(`Failed to follow company: ${error.message}`);
    }
  }

  // Unfollow a company
  async unfollowCompany(jobSeekerId, companyId) {
    try {
      // Find and delete the follow record
      const deletedFollow = await CompanyFollower.findOneAndDelete({
        jobSeeker: jobSeekerId,
        company: companyId
      });

      if (!deletedFollow) {
        throw new Error('You are not following this company');
      }

      // Decrement company follower count
      await Company.findByIdAndUpdate(companyId, { 
        $inc: { 'stats.followerCount': -1 } 
      });

      return deletedFollow;
    } catch (error) {
      throw new Error(`Failed to unfollow company: ${error.message}`);
    }
  }

  // Get user's followed companies
  async getFollowedCompanies(jobSeekerId, page = 1, limit = 20) {
    try {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [followedCompanies, totalCount] = await Promise.all([
        CompanyFollower.find({ jobSeeker: jobSeekerId })
          .populate({
            path: 'company',
            select: 'name logo industry location description stats.activeJobs stats.followerCount isVerified',
            match: { isActive: true } // Only include active companies
          })
          .sort({ followedAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        CompanyFollower.countDocuments({ jobSeeker: jobSeekerId })
      ]);

      // Filter out follows where company has been deleted or deactivated
      const activeFollowedCompanies = followedCompanies.filter(follow => follow.company);

      // Clean up any follows that reference deleted companies
      const validFollowIds = activeFollowedCompanies.map(follow => follow._id);
      const allFollowIds = followedCompanies.map(follow => follow._id);
      const invalidFollowIds = allFollowIds.filter(id => !validFollowIds.includes(id));
      
      if (invalidFollowIds.length > 0) {
        await CompanyFollower.deleteMany({ _id: { $in: invalidFollowIds } });
      }

      const totalPages = Math.ceil(activeFollowedCompanies.length / limitNum);

      return {
        followedCompanies: activeFollowedCompanies,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalFollowedCompanies: activeFollowedCompanies.length,
          companiesPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to get followed companies: ${error.message}`);
    }
  }

  // Check if user is following a company
  async isFollowingCompany(jobSeekerId, companyId) {
    try {
      const follow = await CompanyFollower.findOne({
        jobSeeker: jobSeekerId,
        company: companyId
      });

      return {
        isFollowing: !!follow,
        followId: follow ? follow._id : null,
        followedAt: follow ? follow.followedAt : null
      };
    } catch (error) {
      throw new Error(`Failed to check if following company: ${error.message}`);
    }
  }

  // Get company statistics
  async getCompanyStats(companyId) {
    try {
      const company = await Company.findById(companyId).select('stats');
      if (!company) {
        throw new Error('Company not found');
      }

      // Get additional real-time stats
      const [activeJobCount, totalApplications] = await Promise.all([
        Job.countDocuments({ company: companyId, isActive: true }),
        Job.aggregate([
          { $match: { company: companyId } },
          { $group: { _id: null, totalApplications: { $sum: '$applicationCount' } } }
        ])
      ]);

      // Update company stats if they're outdated
      const updatedStats = {
        ...company.stats,
        activeJobs: activeJobCount,
        totalApplications: totalApplications[0]?.totalApplications || 0
      };

      await Company.findByIdAndUpdate(companyId, { stats: updatedStats });

      return updatedStats;
    } catch (error) {
      throw new Error(`Failed to get company stats: ${error.message}`);
    }
  }

  // Get popular/trending companies
  async getTrendingCompanies(limit = 10) {
    try {
      const companies = await Company.find({ isActive: true })
        .select('name logo industry location stats.followerCount stats.activeJobs isVerified')
        .sort({ 
          'stats.followerCount': -1, 
          'stats.activeJobs': -1,
          isVerified: -1 
        })
        .limit(parseInt(limit))
        .lean();

      return companies;
    } catch (error) {
      throw new Error(`Failed to get trending companies: ${error.message}`);
    }
  }
}

module.exports = new CompanyService();