const jobSeekerService = require('./jobSeeker.service');

// Helper function for consistent response format
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

class JobSeekerController {

  // GET /js/profile - Get full job seeker profile
  async getProfile(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id; // Assuming auth middleware sets req.user
      
      const profileData = await jobSeekerService.getFullProfile(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Profile retrieved successfully', profileData);
    } catch (error) {
      return sendResponse(res, 404, false, error.message);
    }
  }

  // PATCH /js/profile/general - Update general information
  async updateGeneralInfo(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const updateData = req.body;
      
      const updatedProfile = await jobSeekerService.updateGeneralInfo(jobSeekerId, updateData);
      
      return sendResponse(res, 200, true, 'General information updated successfully', updatedProfile);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/profile/summary - Update professional summary
  async updateSummary(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { summary } = req.body;
      
      if (summary === undefined) {
        return sendResponse(res, 400, false, 'Summary is required');
      }
      
      const updatedProfile = await jobSeekerService.updateSummary(jobSeekerId, summary);
      
      return sendResponse(res, 200, true, 'Professional summary updated successfully', {
        summary: updatedProfile.summary
      });
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // WORK EXPERIENCE CRUD OPERATIONS

  // GET /js/profile/experiences - Get all work experiences
  async getWorkExperiences(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const experiences = await jobSeekerService.getWorkExperiences(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Work experiences retrieved successfully', experiences);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/profile/experiences - Create work experience
  async createWorkExperience(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const experienceData = req.body;
      
      const newExperience = await jobSeekerService.createWorkExperience(jobSeekerId, experienceData);
      
      return sendResponse(res, 201, true, 'Work experience created successfully', newExperience);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/profile/experiences/:experienceId - Update work experience
  async updateWorkExperience(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { experienceId } = req.params;
      const updateData = req.body;
      
      const updatedExperience = await jobSeekerService.updateWorkExperience(jobSeekerId, experienceId, updateData);
      
      return sendResponse(res, 200, true, 'Work experience updated successfully', updatedExperience);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/profile/experiences/:experienceId - Delete work experience
  async deleteWorkExperience(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { experienceId } = req.params;
      
      await jobSeekerService.deleteWorkExperience(jobSeekerId, experienceId);
      
      return sendResponse(res, 200, true, 'Work experience deleted successfully');
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // EDUCATION CRUD OPERATIONS

  // GET /js/profile/education - Get all education records
  async getEducation(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const education = await jobSeekerService.getEducation(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Education records retrieved successfully', education);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/profile/education - Create education record
  async createEducation(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const educationData = req.body;
      
      const newEducation = await jobSeekerService.createEducation(jobSeekerId, educationData);
      
      return sendResponse(res, 201, true, 'Education record created successfully', newEducation);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/profile/education/:educationId - Update education record
  async updateEducation(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { educationId } = req.params;
      const updateData = req.body;
      
      const updatedEducation = await jobSeekerService.updateEducation(jobSeekerId, educationId, updateData);
      
      return sendResponse(res, 200, true, 'Education record updated successfully', updatedEducation);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/profile/education/:educationId - Delete education record
  async deleteEducation(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { educationId } = req.params;
      
      await jobSeekerService.deleteEducation(jobSeekerId, educationId);
      
      return sendResponse(res, 200, true, 'Education record deleted successfully');
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // SKILLS OPERATIONS

  // PUT /js/profile/skills - Replace all skills
  async updateSkills(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { skills } = req.body;
      
      if (!Array.isArray(skills)) {
        return sendResponse(res, 400, false, 'Skills must be an array');
      }
      
      const updatedSkills = await jobSeekerService.updateSkills(jobSeekerId, skills);
      
      return sendResponse(res, 200, true, 'Skills updated successfully', updatedSkills);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // GET /js/profile/skills - Get all skills
  async getSkills(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const skills = await jobSeekerService.getSkills(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Skills retrieved successfully', skills);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // JOB INTERESTS/PREFERENCES OPERATIONS

  // PUT /js/profile/interests - Update job interests (Upsert)
  async updateJobInterests(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const interestsData = req.body;
      
      const updatedInterests = await jobSeekerService.updateJobInterests(jobSeekerId, interestsData);
      
      return sendResponse(res, 200, true, 'Job interests updated successfully', updatedInterests);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // AWARD CRUD OPERATIONS

  // GET /js/profile/awards - Get all awards
  async getAwards(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const awards = await jobSeekerService.getAwards(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Awards retrieved successfully', awards);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/profile/awards - Create award
  async createAward(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const awardData = req.body;
      
      const newAward = await jobSeekerService.createAward(jobSeekerId, awardData);
      
      return sendResponse(res, 201, true, 'Award created successfully', newAward);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/profile/awards/:awardId - Update award
  async updateAward(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { awardId } = req.params;
      const updateData = req.body;
      
      const updatedAward = await jobSeekerService.updateAward(jobSeekerId, awardId, updateData);
      
      return sendResponse(res, 200, true, 'Award updated successfully', updatedAward);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/profile/awards/:awardId - Delete award
  async deleteAward(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { awardId } = req.params;
      
      await jobSeekerService.deleteAward(jobSeekerId, awardId);
      
      return sendResponse(res, 200, true, 'Award deleted successfully');
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // CERTIFICATE CRUD OPERATIONS

  // GET /js/profile/certificates - Get all certificates
  async getCertificates(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const certificates = await jobSeekerService.getCertificates(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Certificates retrieved successfully', certificates);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/profile/certificates - Create certificate
  async createCertificate(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const certificateData = req.body;
      
      const newCertificate = await jobSeekerService.createCertificate(jobSeekerId, certificateData);
      
      return sendResponse(res, 201, true, 'Certificate created successfully', newCertificate);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // PUT /js/profile/certificates/:certificateId - Update certificate
  async updateCertificate(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { certificateId } = req.params;
      const updateData = req.body;
      
      const updatedCertificate = await jobSeekerService.updateCertificate(jobSeekerId, certificateId, updateData);
      
      return sendResponse(res, 200, true, 'Certificate updated successfully', updatedCertificate);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/profile/certificates/:certificateId - Delete certificate
  async deleteCertificate(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { certificateId } = req.params;
      
      await jobSeekerService.deleteCertificate(jobSeekerId, certificateId);
      
      return sendResponse(res, 200, true, 'Certificate deleted successfully');
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // RESUME MANAGEMENT OPERATIONS

  // GET /js/profile/resume - Get all resumes
  async getResumes(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      const resumes = await jobSeekerService.getResumes(jobSeekerId);
      
      return sendResponse(res, 200, true, 'Resumes retrieved successfully', resumes);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // POST /js/profile/resume - Create resume (with file upload)
  async createResume(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      
      // Check if file was uploaded
      if (!req.file) {
        return sendResponse(res, 400, false, 'Resume file is required');
      }
      
      const resumeData = {
        name: req.body.name || req.file.originalname,
        url: req.file.path || req.file.location, // Depends on your file storage setup
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        description: req.body.description,
        version: req.body.version || '1.0'
      };
      
      const newResume = await jobSeekerService.createResume(jobSeekerId, resumeData);
      
      return sendResponse(res, 201, true, 'Resume uploaded successfully', newResume);
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }

  // DELETE /js/profile/resume/:resumeId - Delete resume
  async deleteResume(req, res) {
    try {
      const jobSeekerId = req.user?.id || req.params.id;
      const { resumeId } = req.params;
      
      await jobSeekerService.deleteResume(jobSeekerId, resumeId);
      
      return sendResponse(res, 200, true, 'Resume deleted successfully');
    } catch (error) {
      return sendResponse(res, 400, false, error.message);
    }
  }
}

module.exports = new JobSeekerController();