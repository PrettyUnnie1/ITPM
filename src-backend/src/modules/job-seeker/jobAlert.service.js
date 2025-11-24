const { JobAlert, Job } = require('./models');

class JobAlertService {

  // Create a new job alert
  async createJobAlert(jobSeekerId, alertData) {
    try {
      const {
        name,
        keywords,
        location,
        industry,
        jobType,
        experienceLevel,
        salaryRange,
        frequency,
        notificationChannels,
        advancedFilters
      } = alertData;

      // Validate required fields
      if (!keywords || keywords.length === 0) {
        throw new Error('At least one keyword is required');
      }
      if (!location || location.length === 0) {
        throw new Error('At least one location is required');
      }

      // Create the alert
      const jobAlert = new JobAlert({
        jobSeeker: jobSeekerId,
        name: name || `Alert for ${keywords.join(', ')}`,
        keywords: keywords.map(k => k.trim()),
        location: location.map(l => l.trim()),
        industry: industry || [],
        jobType: jobType || [],
        experienceLevel: experienceLevel || [],
        salaryRange: {
          min: salaryRange?.min || null,
          max: salaryRange?.max || null,
          currency: salaryRange?.currency || 'VND'
        },
        frequency: frequency || 'daily',
        notificationChannels: {
          inApp: notificationChannels?.inApp ?? true,
          email: notificationChannels?.email ?? true
        },
        advancedFilters: advancedFilters || {}
      });

      await jobAlert.save();
      return jobAlert;
    } catch (error) {
      throw new Error(`Failed to create job alert: ${error.message}`);
    }
  }

  // Get all job alerts for a user
  async getJobAlerts(jobSeekerId, activeOnly = false) {
    try {
      const query = { jobSeeker: jobSeekerId };
      if (activeOnly) {
        query.isActive = true;
      }

      const alerts = await JobAlert.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return alerts;
    } catch (error) {
      throw new Error(`Failed to get job alerts: ${error.message}`);
    }
  }

  // Update a job alert
  async updateJobAlert(jobSeekerId, alertId, updateData) {
    try {
      const {
        name,
        keywords,
        location,
        industry,
        jobType,
        experienceLevel,
        salaryRange,
        frequency,
        notificationChannels,
        advancedFilters
      } = updateData;

      // Build update object
      const update = {};
      
      if (name !== undefined) update.name = name;
      if (keywords !== undefined) {
        if (keywords.length === 0) {
          throw new Error('At least one keyword is required');
        }
        update.keywords = keywords.map(k => k.trim());
      }
      if (location !== undefined) {
        if (location.length === 0) {
          throw new Error('At least one location is required');
        }
        update.location = location.map(l => l.trim());
      }
      if (industry !== undefined) update.industry = industry;
      if (jobType !== undefined) update.jobType = jobType;
      if (experienceLevel !== undefined) update.experienceLevel = experienceLevel;
      if (frequency !== undefined) update.frequency = frequency;
      
      if (salaryRange !== undefined) {
        update.salaryRange = {
          min: salaryRange.min || null,
          max: salaryRange.max || null,
          currency: salaryRange.currency || 'VND'
        };
      }
      
      if (notificationChannels !== undefined) {
        update.notificationChannels = notificationChannels;
      }
      
      if (advancedFilters !== undefined) {
        update.advancedFilters = advancedFilters;
      }

      const updatedAlert = await JobAlert.findOneAndUpdate(
        { _id: alertId, jobSeeker: jobSeekerId },
        update,
        { new: true, runValidators: true }
      );

      if (!updatedAlert) {
        throw new Error('Job alert not found');
      }

      return updatedAlert;
    } catch (error) {
      throw new Error(`Failed to update job alert: ${error.message}`);
    }
  }

  // Delete a job alert
  async deleteJobAlert(jobSeekerId, alertId) {
    try {
      const deletedAlert = await JobAlert.findOneAndDelete({
        _id: alertId,
        jobSeeker: jobSeekerId
      });

      if (!deletedAlert) {
        throw new Error('Job alert not found');
      }

      return deletedAlert;
    } catch (error) {
      throw new Error(`Failed to delete job alert: ${error.message}`);
    }
  }

  // Toggle job alert status (active/inactive)
  async toggleJobAlert(jobSeekerId, alertId) {
    try {
      const alert = await JobAlert.findOne({
        _id: alertId,
        jobSeeker: jobSeekerId
      });

      if (!alert) {
        throw new Error('Job alert not found');
      }

      alert.isActive = !alert.isActive;
      await alert.save();

      return {
        alert,
        status: alert.isActive ? 'activated' : 'deactivated',
        message: `Job alert ${alert.isActive ? 'activated' : 'deactivated'} successfully`
      };
    } catch (error) {
      throw new Error(`Failed to toggle job alert: ${error.message}`);
    }
  }

  // Search for jobs matching alert criteria
  async searchJobsForAlert(alert) {
    try {
      // Build search query based on alert criteria
      const query = { isActive: true };
      
      // Keywords search (title and description)
      if (alert.keywords.length > 0) {
        const keywordRegex = alert.keywords.map(keyword => 
          new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        );
        query.$or = [
          { title: { $in: keywordRegex } },
          { description: { $in: keywordRegex } },
          { requirements: { $in: keywordRegex } }
        ];
      }

      // Location filter
      if (alert.location.length > 0) {
        query.location = { 
          $in: alert.location.map(loc => new RegExp(loc, 'i'))
        };
      }

      // Industry filter
      if (alert.industry.length > 0) {
        query.industry = { $in: alert.industry };
      }

      // Job type filter
      if (alert.jobType.length > 0) {
        query.type = { $in: alert.jobType };
      }

      // Experience level filter
      if (alert.experienceLevel.length > 0) {
        query.level = { $in: alert.experienceLevel };
      }

      // Salary range filter
      if (alert.salaryRange.min || alert.salaryRange.max) {
        query.salaryCurrency = alert.salaryRange.currency;
        
        if (alert.salaryRange.min && alert.salaryRange.max) {
          query.$and = [
            { salaryMin: { $gte: alert.salaryRange.min } },
            { salaryMax: { $lte: alert.salaryRange.max } }
          ];
        } else if (alert.salaryRange.min) {
          query.salaryMin = { $gte: alert.salaryRange.min };
        } else if (alert.salaryRange.max) {
          query.salaryMax = { $lte: alert.salaryRange.max };
        }
      }

      // Only get jobs posted after last execution
      if (alert.stats.lastTriggered) {
        query.createdAt = { $gte: alert.stats.lastTriggered };
      }

      // Execute search
      const jobs = await Job.find(query)
        .populate('company', 'name logo industry')
        .sort({ createdAt: -1 })
        .limit(100) // Limit results for performance
        .lean();

      return jobs;
    } catch (error) {
      throw new Error(`Failed to search jobs for alert: ${error.message}`);
    }
  }

  // Execute a job alert (find matching jobs and create notifications)
  async executeJobAlert(alertId) {
    try {
      const alert = await JobAlert.findById(alertId);
      if (!alert || !alert.isActive) {
        throw new Error('Job alert not found or inactive');
      }

      // Search for matching jobs
      const matchingJobs = await this.searchJobsForAlert(alert);
      const newJobsCount = matchingJobs.length;

      // Update alert statistics
      const updateData = {
        'stats.lastTriggered': new Date(),
        'stats.totalJobsFound': alert.stats.totalJobsFound + newJobsCount,
        'lastExecution.executedAt': new Date(),
        'lastExecution.jobsFound': newJobsCount,
        'lastExecution.newJobsCount': newJobsCount
      };

      if (newJobsCount > 0) {
        updateData['stats.lastJobFound'] = new Date();
      }

      await JobAlert.findByIdAndUpdate(alertId, updateData);

      return {
        alert,
        matchingJobs,
        newJobsCount,
        executedAt: new Date()
      };
    } catch (error) {
      // Update alert with error information
      await JobAlert.findByIdAndUpdate(alertId, {
        'lastExecution.executedAt': new Date(),
        'lastExecution.error': error.message,
        'lastExecution.jobsFound': 0,
        'lastExecution.newJobsCount': 0
      });
      
      throw new Error(`Failed to execute job alert: ${error.message}`);
    }
  }

  // Execute all alerts for a specific frequency
  async executeAlertsByFrequency(frequency) {
    try {
      const alerts = await JobAlert.getAlertsForExecution(frequency);
      const results = [];

      for (const alert of alerts) {
        try {
          const result = await this.executeJobAlert(alert._id);
          results.push({
            alertId: alert._id,
            alertName: alert.name,
            jobSeekerId: alert.jobSeeker._id,
            success: true,
            ...result
          });
        } catch (error) {
          results.push({
            alertId: alert._id,
            alertName: alert.name,
            jobSeekerId: alert.jobSeeker._id,
            success: false,
            error: error.message
          });
        }
      }

      return {
        frequency,
        totalAlertsProcessed: alerts.length,
        successfulExecutions: results.filter(r => r.success).length,
        failedExecutions: results.filter(r => !r.success).length,
        results
      };
    } catch (error) {
      throw new Error(`Failed to execute alerts by frequency: ${error.message}`);
    }
  }

  // Get alert statistics for a user
  async getAlertStatistics(jobSeekerId) {
    try {
      const stats = await JobAlert.aggregate([
        { $match: { jobSeeker: jobSeekerId } },
        {
          $group: {
            _id: null,
            totalAlerts: { $sum: 1 },
            activeAlerts: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            totalJobsFound: { $sum: '$stats.totalJobsFound' },
            averageJobsPerAlert: { $avg: '$stats.totalJobsFound' },
            frequencyStats: {
              $push: {
                frequency: '$frequency',
                isActive: '$isActive'
              }
            }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalAlerts: 0,
          activeAlerts: 0,
          totalJobsFound: 0,
          averageJobsPerAlert: 0,
          byFrequency: {}
        };
      }

      const result = stats[0];
      
      // Calculate frequency statistics
      const frequencyStats = result.frequencyStats.reduce((acc, item) => {
        if (!acc[item.frequency]) {
          acc[item.frequency] = { total: 0, active: 0 };
        }
        acc[item.frequency].total++;
        if (item.isActive) {
          acc[item.frequency].active++;
        }
        return acc;
      }, {});

      return {
        totalAlerts: result.totalAlerts,
        activeAlerts: result.activeAlerts,
        totalJobsFound: result.totalJobsFound,
        averageJobsPerAlert: Math.round(result.averageJobsPerAlert || 0),
        byFrequency: frequencyStats
      };
    } catch (error) {
      throw new Error(`Failed to get alert statistics: ${error.message}`);
    }
  }
}

module.exports = new JobAlertService();