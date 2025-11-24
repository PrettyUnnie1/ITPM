const { 
  JobSeeker, 
  WorkExperience, 
  Education, 
  Skill, 
  Certificate,
  JobInterest,
  Award,
  Resume 
} = require('./models');

class JobSeekerService {
  
  // Get full job seeker profile with all nested data
  async getFullProfile(jobSeekerId) {
    try {
      const jobSeeker = await JobSeeker.findById(jobSeekerId);
      if (!jobSeeker) {
        throw new Error('Job seeker not found');
      }

      // Get all related data
      const [workExperiences, education, skills, certificates, awards, resumes, jobInterest] = await Promise.all([
        WorkExperience.find({ jobSeeker: jobSeekerId }).sort({ startDate: -1 }),
        Education.find({ jobSeeker: jobSeekerId }).sort({ endDate: -1 }),
        Skill.find({ jobSeeker: jobSeekerId }).sort({ isFeatured: -1, proficiencyLevel: 1 }),
        Certificate.find({ jobSeeker: jobSeekerId }).sort({ issueDate: -1 }),
        Award.find({ jobSeeker: jobSeekerId }).sort({ issueDate: -1 }),
        Resume.find({ jobSeeker: jobSeekerId }).sort({ isPrimary: -1, uploadedAt: -1 }),
        JobInterest.findOne({ jobSeeker: jobSeekerId })
      ]);

      return {
        profile: jobSeeker,
        workExperiences,
        education,
        skills,
        certificates,
        awards,
        resumes,
        jobInterest
      };
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Update general information
  async updateGeneralInfo(jobSeekerId, updateData) {
    try {
      const allowedFields = ['firstName', 'lastName', 'phone', 'avatarUrl', 'location', 'dob', 'gender'];
      const filteredData = {};
      
      // Filter only allowed fields
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      const updatedProfile = await JobSeeker.findByIdAndUpdate(
        jobSeekerId,
        filteredData,
        { new: true, runValidators: true }
      );

      if (!updatedProfile) {
        throw new Error('Job seeker not found');
      }

      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update general info: ${error.message}`);
    }
  }

  // Update professional summary
  async updateSummary(jobSeekerId, summary) {
    try {
      const updatedProfile = await JobSeeker.findByIdAndUpdate(
        jobSeekerId,
        { summary },
        { new: true, runValidators: true }
      );

      if (!updatedProfile) {
        throw new Error('Job seeker not found');
      }

      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update summary: ${error.message}`);
    }
  }

  // CRUD Operations for Work Experience
  async createWorkExperience(jobSeekerId, experienceData) {
    try {
      const workExperience = new WorkExperience({
        ...experienceData,
        jobSeeker: jobSeekerId
      });

      return await workExperience.save();
    } catch (error) {
      throw new Error(`Failed to create work experience: ${error.message}`);
    }
  }

  async getWorkExperiences(jobSeekerId) {
    try {
      return await WorkExperience.find({ jobSeeker: jobSeekerId }).sort({ startDate: -1 });
    } catch (error) {
      throw new Error(`Failed to get work experiences: ${error.message}`);
    }
  }

  async updateWorkExperience(jobSeekerId, experienceId, updateData) {
    try {
      const updatedExperience = await WorkExperience.findOneAndUpdate(
        { _id: experienceId, jobSeeker: jobSeekerId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedExperience) {
        throw new Error('Work experience not found');
      }

      return updatedExperience;
    } catch (error) {
      throw new Error(`Failed to update work experience: ${error.message}`);
    }
  }

  async deleteWorkExperience(jobSeekerId, experienceId) {
    try {
      const deletedExperience = await WorkExperience.findOneAndDelete({
        _id: experienceId,
        jobSeeker: jobSeekerId
      });

      if (!deletedExperience) {
        throw new Error('Work experience not found');
      }

      return deletedExperience;
    } catch (error) {
      throw new Error(`Failed to delete work experience: ${error.message}`);
    }
  }

  // CRUD Operations for Education
  async createEducation(jobSeekerId, educationData) {
    try {
      const education = new Education({
        ...educationData,
        jobSeeker: jobSeekerId
      });

      return await education.save();
    } catch (error) {
      throw new Error(`Failed to create education: ${error.message}`);
    }
  }

  async getEducation(jobSeekerId) {
    try {
      return await Education.find({ jobSeeker: jobSeekerId }).sort({ endDate: -1 });
    } catch (error) {
      throw new Error(`Failed to get education: ${error.message}`);
    }
  }

  async updateEducation(jobSeekerId, educationId, updateData) {
    try {
      const updatedEducation = await Education.findOneAndUpdate(
        { _id: educationId, jobSeeker: jobSeekerId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedEducation) {
        throw new Error('Education record not found');
      }

      return updatedEducation;
    } catch (error) {
      throw new Error(`Failed to update education: ${error.message}`);
    }
  }

  async deleteEducation(jobSeekerId, educationId) {
    try {
      const deletedEducation = await Education.findOneAndDelete({
        _id: educationId,
        jobSeeker: jobSeekerId
      });

      if (!deletedEducation) {
        throw new Error('Education record not found');
      }

      return deletedEducation;
    } catch (error) {
      throw new Error(`Failed to delete education: ${error.message}`);
    }
  }

  // Update Skills (PUT operation - replace all skills)
  async updateSkills(jobSeekerId, skillsData) {
    try {
      // First, delete all existing skills
      await Skill.deleteMany({ jobSeeker: jobSeekerId });

      // Then create new skills
      const skills = skillsData.map(skill => ({
        ...skill,
        jobSeeker: jobSeekerId
      }));

      const createdSkills = await Skill.insertMany(skills);
      
      // Return sorted skills (featured first, then by proficiency level)
      return await Skill.find({ jobSeeker: jobSeekerId })
        .sort({ isFeatured: -1, proficiencyLevel: 1 });
    } catch (error) {
      throw new Error(`Failed to update skills: ${error.message}`);
    }
  }

  // Get skills only
  async getSkills(jobSeekerId) {
    try {
      return await Skill.find({ jobSeeker: jobSeekerId })
        .sort({ isFeatured: -1, proficiencyLevel: 1 });
    } catch (error) {
      throw new Error(`Failed to get skills: ${error.message}`);
    }
  }

  // JOB INTERESTS/PREFERENCES OPERATIONS
  
  // Update or create job interests (Upsert)
  async updateJobInterests(jobSeekerId, interestsData) {
    try {
      const updatedInterests = await JobInterest.findOneAndUpdate(
        { jobSeeker: jobSeekerId },
        { ...interestsData, jobSeeker: jobSeekerId },
        { new: true, upsert: true, runValidators: true }
      );

      return updatedInterests;
    } catch (error) {
      throw new Error(`Failed to update job interests: ${error.message}`);
    }
  }

  // AWARD CRUD OPERATIONS

  async createAward(jobSeekerId, awardData) {
    try {
      const award = new Award({
        ...awardData,
        jobSeeker: jobSeekerId
      });

      return await award.save();
    } catch (error) {
      throw new Error(`Failed to create award: ${error.message}`);
    }
  }

  async getAwards(jobSeekerId) {
    try {
      return await Award.find({ jobSeeker: jobSeekerId }).sort({ issueDate: -1 });
    } catch (error) {
      throw new Error(`Failed to get awards: ${error.message}`);
    }
  }

  async updateAward(jobSeekerId, awardId, updateData) {
    try {
      const updatedAward = await Award.findOneAndUpdate(
        { _id: awardId, jobSeeker: jobSeekerId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAward) {
        throw new Error('Award not found');
      }

      return updatedAward;
    } catch (error) {
      throw new Error(`Failed to update award: ${error.message}`);
    }
  }

  async deleteAward(jobSeekerId, awardId) {
    try {
      const deletedAward = await Award.findOneAndDelete({
        _id: awardId,
        jobSeeker: jobSeekerId
      });

      if (!deletedAward) {
        throw new Error('Award not found');
      }

      return deletedAward;
    } catch (error) {
      throw new Error(`Failed to delete award: ${error.message}`);
    }
  }

  // CERTIFICATE CRUD OPERATIONS

  async createCertificate(jobSeekerId, certificateData) {
    try {
      const certificate = new Certificate({
        ...certificateData,
        jobSeeker: jobSeekerId
      });

      return await certificate.save();
    } catch (error) {
      throw new Error(`Failed to create certificate: ${error.message}`);
    }
  }

  async getCertificates(jobSeekerId) {
    try {
      return await Certificate.find({ jobSeeker: jobSeekerId }).sort({ issueDate: -1 });
    } catch (error) {
      throw new Error(`Failed to get certificates: ${error.message}`);
    }
  }

  async updateCertificate(jobSeekerId, certificateId, updateData) {
    try {
      const updatedCertificate = await Certificate.findOneAndUpdate(
        { _id: certificateId, jobSeeker: jobSeekerId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedCertificate) {
        throw new Error('Certificate not found');
      }

      return updatedCertificate;
    } catch (error) {
      throw new Error(`Failed to update certificate: ${error.message}`);
    }
  }

  async deleteCertificate(jobSeekerId, certificateId) {
    try {
      const deletedCertificate = await Certificate.findOneAndDelete({
        _id: certificateId,
        jobSeeker: jobSeekerId
      });

      if (!deletedCertificate) {
        throw new Error('Certificate not found');
      }

      return deletedCertificate;
    } catch (error) {
      throw new Error(`Failed to delete certificate: ${error.message}`);
    }
  }

  // RESUME MANAGEMENT OPERATIONS

  async createResume(jobSeekerId, resumeData) {
    try {
      const resume = new Resume({
        ...resumeData,
        jobSeeker: jobSeekerId
      });

      return await resume.save();
    } catch (error) {
      throw new Error(`Failed to create resume: ${error.message}`);
    }
  }

  async getResumes(jobSeekerId) {
    try {
      return await Resume.find({ jobSeeker: jobSeekerId })
        .sort({ isPrimary: -1, uploadedAt: -1 });
    } catch (error) {
      throw new Error(`Failed to get resumes: ${error.message}`);
    }
  }

  async deleteResume(jobSeekerId, resumeId) {
    try {
      const deletedResume = await Resume.findOneAndDelete({
        _id: resumeId,
        jobSeeker: jobSeekerId
      });

      if (!deletedResume) {
        throw new Error('Resume not found');
      }

      return deletedResume;
    } catch (error) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
  }
}

module.exports = new JobSeekerService();