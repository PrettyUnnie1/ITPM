const { SavedJob, Job, Company } = require('./models');

class SavedJobsService {

  // Save/bookmark a job
  async saveJob(jobSeekerId, jobId, metadata = {}) {
    try {
      // Check if job exists and is active
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      if (!job.isActive) {
        throw new Error('This job posting is no longer available');
      }

      // Check if user has already saved this job
      const existingSavedJob = await SavedJob.findOne({
        jobSeeker: jobSeekerId,
        job: jobId
      });

      if (existingSavedJob) {
        throw new Error('You have already saved this job');
      }

      // Create saved job record
      const savedJob = new SavedJob({
        jobSeeker: jobSeekerId,
        job: jobId,
        tags: metadata.tags || [],
        notes: metadata.notes || ''
      });

      await savedJob.save();

      // Return saved job with populated data
      const populatedSavedJob = await SavedJob.findById(savedJob._id)
        .populate({
          path: 'job',
          select: 'title company companyLogo location salaryMin salaryMax salaryCurrency type level applicationDeadline',
          populate: {
            path: 'company',
            model: 'Company',
            select: 'name logo industry location'
          }
        });

      return populatedSavedJob;
    } catch (error) {
      throw new Error(`Failed to save job: ${error.message}`);
    }
  }

  // Get user's saved jobs with pagination
  async getSavedJobs(jobSeekerId, page = 1, limit = 20) {
    try {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(50, parseInt(limit))); // Max 50 per page
      const skip = (pageNum - 1) * limitNum;

      const [savedJobs, totalCount] = await Promise.all([
        SavedJob.find({ jobSeeker: jobSeekerId })
          .populate({
            path: 'job',
            select: 'title company companyLogo location salaryMin salaryMax salaryCurrency type level applicationDeadline createdAt isActive',
            populate: {
              path: 'company',
              model: 'Company',
              select: 'name logo industry location website'
            }
          })
          .sort({ savedAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        SavedJob.countDocuments({ jobSeeker: jobSeekerId })
      ]);

      // Filter out saved jobs where the job is no longer active or has been deleted
      const activeSavedJobs = savedJobs.filter(savedJob => 
        savedJob.job && savedJob.job.isActive !== false
      );

      // Clean up any saved jobs that reference deleted jobs
      const validJobIds = activeSavedJobs.map(savedJob => savedJob._id);
      const allSavedJobIds = savedJobs.map(savedJob => savedJob._id);
      const invalidJobIds = allSavedJobIds.filter(id => !validJobIds.includes(id));
      
      if (invalidJobIds.length > 0) {
        await SavedJob.deleteMany({ _id: { $in: invalidJobIds } });
      }

      const totalPages = Math.ceil(activeSavedJobs.length / limitNum);

      return {
        savedJobs: activeSavedJobs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalSavedJobs: activeSavedJobs.length,
          jobsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to get saved jobs: ${error.message}`);
    }
  }

  // Remove a job from saved list
  async unsaveJob(jobSeekerId, savedJobId) {
    try {
      // Find and delete the saved job record
      const deletedSavedJob = await SavedJob.findOneAndDelete({
        _id: savedJobId,
        jobSeeker: jobSeekerId
      });

      if (!deletedSavedJob) {
        throw new Error('Saved job not found');
      }

      return deletedSavedJob;
    } catch (error) {
      throw new Error(`Failed to remove saved job: ${error.message}`);
    }
  }

  // Check if a job is saved by user
  async isJobSaved(jobSeekerId, jobId) {
    try {
      const savedJob = await SavedJob.findOne({
        jobSeeker: jobSeekerId,
        job: jobId
      });

      return {
        isSaved: !!savedJob,
        savedJobId: savedJob ? savedJob._id : null,
        savedAt: savedJob ? savedJob.savedAt : null
      };
    } catch (error) {
      throw new Error(`Failed to check if job is saved: ${error.message}`);
    }
  }

  // Get saved jobs by tags (for organization)
  async getSavedJobsByTags(jobSeekerId, tags) {
    try {
      const query = {
        jobSeeker: jobSeekerId
      };

      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }

      const savedJobs = await SavedJob.find(query)
        .populate({
          path: 'job',
          select: 'title company companyLogo location salaryMin salaryMax salaryCurrency type level',
          populate: {
            path: 'company',
            model: 'Company',
            select: 'name logo industry'
          }
        })
        .sort({ savedAt: -1 })
        .lean();

      return savedJobs;
    } catch (error) {
      throw new Error(`Failed to get saved jobs by tags: ${error.message}`);
    }
  }

  // Update saved job metadata (tags, notes)
  async updateSavedJob(jobSeekerId, savedJobId, updateData) {
    try {
      const updatedSavedJob = await SavedJob.findOneAndUpdate(
        { _id: savedJobId, jobSeeker: jobSeekerId },
        {
          tags: updateData.tags,
          notes: updateData.notes
        },
        { new: true, runValidators: true }
      ).populate({
        path: 'job',
        select: 'title company location'
      });

      if (!updatedSavedJob) {
        throw new Error('Saved job not found');
      }

      return updatedSavedJob;
    } catch (error) {
      throw new Error(`Failed to update saved job: ${error.message}`);
    }
  }
}

module.exports = new SavedJobsService();