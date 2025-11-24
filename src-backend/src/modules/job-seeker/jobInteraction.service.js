const { Job, Application, JobInterest, Resume } = require('../models');

class JobInteractionService {

  // Search and filter jobs with pagination
  async searchJobs(searchParams) {
    try {
      const { 
        keyword = '', 
        location = '', 
        salaryMin, 
        salaryMax, 
        jobType, 
        page = 1, 
        limit = 20 
      } = searchParams;

      // Build query object
      const query = { isActive: true };
      
      // Keyword search (title, company, description)
      if (keyword.trim()) {
        query.$text = { $search: keyword.trim() };
      }
      
      // Location filter
      if (location.trim()) {
        query.location = { $regex: location.trim(), $options: 'i' };
      }
      
      // Salary range filter
      if (salaryMin || salaryMax) {
        query.$and = query.$and || [];
        
        if (salaryMin) {
          query.$and.push({
            $or: [
              { salaryMax: { $gte: parseInt(salaryMin) } },
              { salaryMin: { $gte: parseInt(salaryMin) } }
            ]
          });
        }
        
        if (salaryMax) {
          query.$and.push({
            $or: [
              { salaryMin: { $lte: parseInt(salaryMax) } },
              { salaryMax: { $lte: parseInt(salaryMax) } }
            ]
          });
        }
      }
      
      // Job type filter
      if (jobType) {
        query.type = jobType;
      }

      // Calculate pagination
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit))); // Max 50 per page
      const skip = (pageNum - 1) * limitNum;

      // Execute query with pagination
      const [jobs, totalCount] = await Promise.all([
        Job.find(query)
          .select('title company companyLogo location salaryMin salaryMax salaryCurrency type level category createdAt applicationCount')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Job.countDocuments(query)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return {
        jobs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalJobs: totalCount,
          jobsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw new Error(`Failed to search jobs: ${error.message}`);
    }
  }

  // Get recommended jobs based on user's job interests
  async getRecommendedJobs(jobSeekerId, page = 1, limit = 10) {
    try {
      // Get user's job interests
      const jobInterest = await JobInterest.findOne({ jobSeeker: jobSeekerId });
      
      if (!jobInterest) {
        throw new Error('Please update your job preferences first to get personalized recommendations');
      }

      // Build recommendation query based on user interests
      const query = { isActive: true };
      const orConditions = [];

      // Match by industry
      if (jobInterest.industry && jobInterest.industry.length > 0) {
        orConditions.push({
          $or: jobInterest.industry.map(ind => ({
            $or: [
              { industry: { $regex: ind, $options: 'i' } },
              { category: { $regex: ind, $options: 'i' } }
            ]
          }))
        });
      }

      // Match by work location
      if (jobInterest.workLocation && jobInterest.workLocation.length > 0) {
        orConditions.push({
          $or: jobInterest.workLocation.map(loc => ({
            location: { $regex: loc, $options: 'i' }
          }))
        });
      }

      // Match by employment type
      if (jobInterest.employmentType) {
        orConditions.push({ type: jobInterest.employmentType });
      }

      // Match by desired level
      if (jobInterest.desiredLevel) {
        orConditions.push({ level: jobInterest.desiredLevel });
      }

      // Match by salary expectations
      if (jobInterest.expectedSalary) {
        const expectedSalary = jobInterest.expectedSalary;
        orConditions.push({
          $or: [
            { 
              salaryMin: { $lte: expectedSalary },
              salaryMax: { $gte: expectedSalary * 0.8 } // Allow 20% lower
            },
            { salaryMin: { $lte: expectedSalary } },
            { salaryMax: { $gte: expectedSalary * 0.8 } }
          ]
        });
      }

      if (orConditions.length > 0) {
        query.$or = orConditions;
      }

      // Calculate pagination
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(20, parseInt(limit))); // Max 20 per page
      const skip = (pageNum - 1) * limitNum;

      // Get recommended jobs
      const [jobs, totalCount] = await Promise.all([
        Job.find(query)
          .select('title company companyLogo location salaryMin salaryMax salaryCurrency type level category createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Job.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      return {
        jobs,
        matchingCriteria: {
          industry: jobInterest.industry,
          workLocation: jobInterest.workLocation,
          employmentType: jobInterest.employmentType,
          desiredLevel: jobInterest.desiredLevel,
          expectedSalary: jobInterest.expectedSalary
        },
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalJobs: totalCount,
          jobsPerPage: limitNum
        }
      };
    } catch (error) {
      throw new Error(`Failed to get recommended jobs: ${error.message}`);
    }
  }

  // Get detailed job information
  async getJobDetails(jobId) {
    try {
      const job = await Job.findById(jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }

      if (!job.isActive) {
        throw new Error('This job posting is no longer available');
      }

      // Increment view count
      await Job.findByIdAndUpdate(jobId, { $inc: { viewCount: 1 } });

      return job;
    } catch (error) {
      throw new Error(`Failed to get job details: ${error.message}`);
    }
  }

  // Apply for a job
  async applyForJob(jobSeekerId, jobId, applicationData) {
    try {
      const { resumeId, coverLetter = '' } = applicationData;

      // Check if job exists and is active
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      if (!job.isActive) {
        throw new Error('This job posting is no longer available');
      }

      // Check if application deadline has passed
      if (job.applicationDeadline && new Date() > job.applicationDeadline) {
        throw new Error('Application deadline has passed');
      }

      // Validate resume exists and belongs to user
      const resume = await Resume.findOne({ _id: resumeId, jobSeeker: jobSeekerId });
      if (!resume) {
        throw new Error('Resume not found or does not belong to you');
      }

      // Check if user has already applied to this job
      const existingApplication = await Application.findOne({
        jobSeeker: jobSeekerId,
        job: jobId
      });

      if (existingApplication) {
        throw new Error('You have already applied to this job');
      }

      // Create application
      const application = new Application({
        jobSeeker: jobSeekerId,
        job: jobId,
        resume: resumeId,
        coverLetter: coverLetter.trim()
      });

      await application.save();

      // Increment application count for the job
      await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

      // Return application with populated data
      const populatedApplication = await Application.findById(application._id)
        .populate('job', 'title company companyLogo location type')
        .populate('resume', 'name url');

      return populatedApplication;
    } catch (error) {
      throw new Error(`Failed to apply for job: ${error.message}`);
    }
  }

  // Get user's applications
  async getUserApplications(jobSeekerId, page = 1, limit = 20) {
    try {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [applications, totalCount] = await Promise.all([
        Application.find({ jobSeeker: jobSeekerId })
          .populate('job', 'title company companyLogo location type salaryMin salaryMax salaryCurrency')
          .populate('resume', 'name')
          .sort({ appliedAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Application.countDocuments({ jobSeeker: jobSeekerId })
      ]);

      const totalPages = Math.ceil(totalCount / limitNum);

      return {
        applications,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalApplications: totalCount,
          applicationsPerPage: limitNum
        }
      };
    } catch (error) {
      throw new Error(`Failed to get applications: ${error.message}`);
    }
  }

  // Withdraw application
  async withdrawApplication(jobSeekerId, applicationId, withdrawalReason = '') {
    try {
      // Find application and verify ownership
      const application = await Application.findOne({
        _id: applicationId,
        jobSeeker: jobSeekerId
      });

      if (!application) {
        throw new Error('Application not found');
      }

      // Check if application can be withdrawn
      if (application.status !== 'pending') {
        throw new Error(`Cannot withdraw application. Current status: ${application.status}. Only pending applications can be withdrawn.`);
      }

      // Update application status to withdrawn
      application.status = 'withdrawn';
      application.withdrawnReason = withdrawalReason.trim();
      await application.save();

      // Decrement application count for the job
      await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });

      return application;
    } catch (error) {
      throw new Error(`Failed to withdraw application: ${error.message}`);
    }
  }
}

module.exports = new JobInteractionService();