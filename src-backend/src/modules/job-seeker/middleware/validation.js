// Input validation middleware for job seeker profile endpoints

const validateJobInterests = (req, res, next) => {
  const { expectedSalary, workLocation, desiredPosition, desiredLevel, employmentType, isOpenToWork } = req.body;
  const errors = [];

  // Validate desiredPosition (required)
  if (!desiredPosition || typeof desiredPosition !== 'string' || desiredPosition.trim().length === 0) {
    errors.push({
      field: 'desiredPosition',
      message: 'Desired position is required and must be a non-empty string'
    });
  } else if (desiredPosition.trim().length > 100) {
    errors.push({
      field: 'desiredPosition',
      message: 'Desired position cannot exceed 100 characters'
    });
  }

  // Validate desiredLevel (required, enum)
  const validLevels = ['Intern', 'Fresher', 'Junior', 'Senior', 'Director'];
  if (!desiredLevel || !validLevels.includes(desiredLevel)) {
    errors.push({
      field: 'desiredLevel',
      message: `Desired level is required and must be one of: ${validLevels.join(', ')}`
    });
  }

  // Validate expectedSalary (required, positive number)
  if (expectedSalary === undefined || expectedSalary === null) {
    errors.push({
      field: 'expectedSalary',
      message: 'Expected salary is required'
    });
  } else if (typeof expectedSalary !== 'number' || isNaN(expectedSalary)) {
    errors.push({
      field: 'expectedSalary',
      message: 'Expected salary must be a valid number'
    });
  } else if (expectedSalary <= 0) {
    errors.push({
      field: 'expectedSalary',
      message: 'Expected salary must be a positive number'
    });
  } else if (expectedSalary > 999999999) {
    errors.push({
      field: 'expectedSalary',
      message: 'Expected salary cannot exceed 999,999,999'
    });
  }

  // Validate workLocation (required, not empty array)
  if (!workLocation) {
    errors.push({
      field: 'workLocation',
      message: 'Work location is required'
    });
  } else if (!Array.isArray(workLocation)) {
    errors.push({
      field: 'workLocation',
      message: 'Work location must be an array'
    });
  } else if (workLocation.length === 0) {
    errors.push({
      field: 'workLocation',
      message: 'Work location cannot be empty. At least one location is required'
    });
  } else {
    // Validate each location in the array
    workLocation.forEach((location, index) => {
      if (!location || typeof location !== 'string' || location.trim().length === 0) {
        errors.push({
          field: `workLocation[${index}]`,
          message: 'Each work location must be a non-empty string'
        });
      } else if (location.trim().length > 100) {
        errors.push({
          field: `workLocation[${index}]`,
          message: 'Each work location cannot exceed 100 characters'
        });
      }
    });
  }

  // Validate employmentType (required, enum)
  const validEmploymentTypes = ['Full-time', 'Part-time', 'Remote', 'Freelance'];
  if (!employmentType || !validEmploymentTypes.includes(employmentType)) {
    errors.push({
      field: 'employmentType',
      message: `Employment type is required and must be one of: ${validEmploymentTypes.join(', ')}`
    });
  }

  // Validate isOpenToWork (required, boolean)
  if (isOpenToWork === undefined || isOpenToWork === null) {
    errors.push({
      field: 'isOpenToWork',
      message: 'Open to work status is required'
    });
  } else if (typeof isOpenToWork !== 'boolean') {
    errors.push({
      field: 'isOpenToWork',
      message: 'Open to work status must be a boolean (true or false)'
    });
  }

  // Optional field validations
  if (req.body.industry) {
    if (!Array.isArray(req.body.industry)) {
      errors.push({
        field: 'industry',
        message: 'Industry must be an array'
      });
    } else {
      req.body.industry.forEach((ind, index) => {
        if (!ind || typeof ind !== 'string' || ind.trim().length === 0) {
          errors.push({
            field: `industry[${index}]`,
            message: 'Each industry must be a non-empty string'
          });
        } else if (ind.trim().length > 50) {
          errors.push({
            field: `industry[${index}]`,
            message: 'Each industry cannot exceed 50 characters'
          });
        }
      });
    }
  }

  // Validate salaryCurrency if provided
  if (req.body.salaryCurrency) {
    const validCurrencies = ['VND', 'USD', 'EUR'];
    if (!validCurrencies.includes(req.body.salaryCurrency)) {
      errors.push({
        field: 'salaryCurrency',
        message: `Salary currency must be one of: ${validCurrencies.join(', ')}`
      });
    }
  }

  // Validate salaryPeriod if provided
  if (req.body.salaryPeriod) {
    const validPeriods = ['Monthly', 'Yearly'];
    if (!validPeriods.includes(req.body.salaryPeriod)) {
      errors.push({
        field: 'salaryPeriod',
        message: `Salary period must be one of: ${validPeriods.join(', ')}`
      });
    }
  }

  // Validate availableStartDate if provided
  if (req.body.availableStartDate) {
    const startDate = new Date(req.body.availableStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(startDate.getTime())) {
      errors.push({
        field: 'availableStartDate',
        message: 'Available start date must be a valid date'
      });
    } else if (startDate < today) {
      errors.push({
        field: 'availableStartDate',
        message: 'Available start date cannot be in the past'
      });
    }
  }

  // Validate notes if provided
  if (req.body.notes && typeof req.body.notes !== 'string') {
    errors.push({
      field: 'notes',
      message: 'Notes must be a string'
    });
  } else if (req.body.notes && req.body.notes.length > 500) {
    errors.push({
      field: 'notes',
      message: 'Notes cannot exceed 500 characters'
    });
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  // Trim string values
  if (req.body.desiredPosition) {
    req.body.desiredPosition = req.body.desiredPosition.trim();
  }
  if (req.body.workLocation && Array.isArray(req.body.workLocation)) {
    req.body.workLocation = req.body.workLocation.map(loc => loc.trim());
  }
  if (req.body.industry && Array.isArray(req.body.industry)) {
    req.body.industry = req.body.industry.map(ind => ind.trim());
  }
  if (req.body.notes) {
    req.body.notes = req.body.notes.trim();
  }

  next();
};

// Validation for job application
const validateJobApplication = (req, res, next) => {
  const { resumeId, coverLetter } = req.body;
  const errors = [];

  // Validate resumeId (required)
  if (!resumeId) {
    errors.push({
      field: 'resumeId',
      message: 'Resume ID is required'
    });
  } else if (typeof resumeId !== 'string' || resumeId.trim().length === 0) {
    errors.push({
      field: 'resumeId',
      message: 'Resume ID must be a non-empty string'
    });
  }

  // Validate coverLetter if provided
  if (coverLetter !== undefined) {
    if (typeof coverLetter !== 'string') {
      errors.push({
        field: 'coverLetter',
        message: 'Cover letter must be a string'
      });
    } else if (coverLetter.length > 2000) {
      errors.push({
        field: 'coverLetter',
        message: 'Cover letter cannot exceed 2000 characters'
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  // Trim cover letter
  if (req.body.coverLetter) {
    req.body.coverLetter = req.body.coverLetter.trim();
  }

  next();
};

// Validation for search parameters
const validateSearchParams = (req, res, next) => {
  const { page, limit, salaryMin, salaryMax } = req.query;
  const errors = [];

  // Validate page if provided
  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({
        field: 'page',
        message: 'Page must be a positive integer'
      });
    }
  }

  // Validate limit if provided
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      errors.push({
        field: 'limit',
        message: 'Limit must be a positive integer between 1 and 50'
      });
    }
  }

  // Validate salary range if provided
  if (salaryMin !== undefined) {
    const minSalary = parseInt(salaryMin);
    if (isNaN(minSalary) || minSalary < 0) {
      errors.push({
        field: 'salaryMin',
        message: 'Minimum salary must be a non-negative number'
      });
    }
  }

  if (salaryMax !== undefined) {
    const maxSalary = parseInt(salaryMax);
    if (isNaN(maxSalary) || maxSalary < 0) {
      errors.push({
        field: 'salaryMax',
        message: 'Maximum salary must be a non-negative number'
      });
    }
  }

  // Validate salary range logic
  if (salaryMin !== undefined && salaryMax !== undefined) {
    const minSalary = parseInt(salaryMin);
    const maxSalary = parseInt(salaryMax);
    if (!isNaN(minSalary) && !isNaN(maxSalary) && minSalary > maxSalary) {
      errors.push({
        field: 'salaryRange',
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  next();
};

// Validation for saving/bookmarking jobs
const validateSaveJob = (req, res, next) => {
  const { jobId, tags, notes } = req.body;
  const errors = [];

  // Validate jobId (required)
  if (!jobId) {
    errors.push({
      field: 'jobId',
      message: 'Job ID is required'
    });
  } else if (typeof jobId !== 'string' || jobId.trim().length === 0) {
    errors.push({
      field: 'jobId',
      message: 'Job ID must be a non-empty string'
    });
  }

  // Validate tags if provided
  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push({
        field: 'tags',
        message: 'Tags must be an array'
      });
    } else {
      tags.forEach((tag, index) => {
        if (typeof tag !== 'string' || tag.trim().length === 0) {
          errors.push({
            field: `tags[${index}]`,
            message: 'Each tag must be a non-empty string'
          });
        } else if (tag.trim().length > 30) {
          errors.push({
            field: `tags[${index}]`,
            message: 'Each tag cannot exceed 30 characters'
          });
        }
      });
    }
  }

  // Validate notes if provided
  if (notes !== undefined) {
    if (typeof notes !== 'string') {
      errors.push({
        field: 'notes',
        message: 'Notes must be a string'
      });
    } else if (notes.length > 500) {
      errors.push({
        field: 'notes',
        message: 'Notes cannot exceed 500 characters'
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  // Trim values
  if (req.body.jobId) {
    req.body.jobId = req.body.jobId.trim();
  }
  if (req.body.tags && Array.isArray(req.body.tags)) {
    req.body.tags = req.body.tags.map(tag => tag.trim());
  }
  if (req.body.notes) {
    req.body.notes = req.body.notes.trim();
  }

  next();
};

// Validation for company follow
const validateFollowCompany = (req, res, next) => {
  const { source } = req.body;
  const errors = [];

  // Validate source if provided
  if (source !== undefined) {
    const validSources = ['search', 'recommendation', 'job_application', 'direct_link', 'other'];
    if (!validSources.includes(source)) {
      errors.push({
        field: 'source',
        message: `Source must be one of: ${validSources.join(', ')}`
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  next();
};

// Validation for job alert creation/update
const validateJobAlert = (req, res, next) => {
  const { keywords, location, frequency, salaryRange, name } = req.body;
  const errors = [];

  // Validate name if provided
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Alert name must be a non-empty string'
      });
    } else if (name.trim().length > 100) {
      errors.push({
        field: 'name',
        message: 'Alert name cannot exceed 100 characters'
      });
    }
  }

  // Validate keywords (required for creation)
  if (keywords !== undefined) {
    if (!Array.isArray(keywords)) {
      errors.push({
        field: 'keywords',
        message: 'Keywords must be an array'
      });
    } else if (keywords.length === 0) {
      errors.push({
        field: 'keywords',
        message: 'At least one keyword is required'
      });
    } else {
      keywords.forEach((keyword, index) => {
        if (typeof keyword !== 'string' || keyword.trim().length === 0) {
          errors.push({
            field: `keywords[${index}]`,
            message: 'Each keyword must be a non-empty string'
          });
        } else if (keyword.trim().length > 50) {
          errors.push({
            field: `keywords[${index}]`,
            message: 'Each keyword cannot exceed 50 characters'
          });
        }
      });
    }
  }

  // Validate location (required for creation)
  if (location !== undefined) {
    if (!Array.isArray(location)) {
      errors.push({
        field: 'location',
        message: 'Location must be an array'
      });
    } else if (location.length === 0) {
      errors.push({
        field: 'location',
        message: 'At least one location is required'
      });
    } else {
      location.forEach((loc, index) => {
        if (typeof loc !== 'string' || loc.trim().length === 0) {
          errors.push({
            field: `location[${index}]`,
            message: 'Each location must be a non-empty string'
          });
        } else if (loc.trim().length > 100) {
          errors.push({
            field: `location[${index}]`,
            message: 'Each location cannot exceed 100 characters'
          });
        }
      });
    }
  }

  // Validate frequency if provided
  if (frequency !== undefined) {
    const validFrequencies = ['instant', 'daily', 'weekly'];
    if (!validFrequencies.includes(frequency)) {
      errors.push({
        field: 'frequency',
        message: `Frequency must be one of: ${validFrequencies.join(', ')}`
      });
    }
  }

  // Validate salary range if provided
  if (salaryRange !== undefined) {
    if (typeof salaryRange !== 'object' || salaryRange === null) {
      errors.push({
        field: 'salaryRange',
        message: 'Salary range must be an object'
      });
    } else {
      const { min, max, currency } = salaryRange;
      
      if (min !== undefined && min !== null) {
        if (typeof min !== 'number' || min < 0) {
          errors.push({
            field: 'salaryRange.min',
            message: 'Minimum salary must be a non-negative number'
          });
        }
      }
      
      if (max !== undefined && max !== null) {
        if (typeof max !== 'number' || max < 0) {
          errors.push({
            field: 'salaryRange.max',
            message: 'Maximum salary must be a non-negative number'
          });
        }
      }
      
      if (min && max && min > max) {
        errors.push({
          field: 'salaryRange',
          message: 'Minimum salary cannot be greater than maximum salary'
        });
      }
      
      if (currency !== undefined) {
        const validCurrencies = ['VND', 'USD', 'EUR'];
        if (!validCurrencies.includes(currency)) {
          errors.push({
            field: 'salaryRange.currency',
            message: `Currency must be one of: ${validCurrencies.join(', ')}`
          });
        }
      }
    }
  }

  // Validate arrays if provided
  const arrayFields = ['industry', 'jobType', 'experienceLevel'];
  arrayFields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (!Array.isArray(req.body[field])) {
        errors.push({
          field: field,
          message: `${field} must be an array`
        });
      }
    }
  });

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  // Trim string values
  if (req.body.name) {
    req.body.name = req.body.name.trim();
  }
  if (req.body.keywords && Array.isArray(req.body.keywords)) {
    req.body.keywords = req.body.keywords.map(k => k.trim());
  }
  if (req.body.location && Array.isArray(req.body.location)) {
    req.body.location = req.body.location.map(l => l.trim());
  }

  next();
};

// Validation for password change
const validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const errors = [];

  // Validate oldPassword (required)
  if (!oldPassword) {
    errors.push({
      field: 'oldPassword',
      message: 'Current password is required'
    });
  } else if (typeof oldPassword !== 'string') {
    errors.push({
      field: 'oldPassword',
      message: 'Current password must be a string'
    });
  }

  // Validate newPassword (required)
  if (!newPassword) {
    errors.push({
      field: 'newPassword',
      message: 'New password is required'
    });
  } else if (typeof newPassword !== 'string') {
    errors.push({
      field: 'newPassword',
      message: 'New password must be a string'
    });
  } else if (newPassword.length < 8) {
    errors.push({
      field: 'newPassword',
      message: 'New password must be at least 8 characters long'
    });
  }

  // Validate confirmPassword if provided
  if (confirmPassword !== undefined) {
    if (typeof confirmPassword !== 'string') {
      errors.push({
        field: 'confirmPassword',
        message: 'Confirm password must be a string'
      });
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.push({
        field: 'confirmPassword',
        message: 'Confirm password does not match new password'
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  next();
};

// Validation for account deletion
const validateAccountDeletion = (req, res, next) => {
  const { password, confirmation } = req.body;
  const errors = [];

  // Validate password (required)
  if (!password) {
    errors.push({
      field: 'password',
      message: 'Password is required to delete account'
    });
  } else if (typeof password !== 'string') {
    errors.push({
      field: 'password',
      message: 'Password must be a string'
    });
  }

  // Validate confirmation (required)
  if (!confirmation) {
    errors.push({
      field: 'confirmation',
      message: 'Deletion confirmation is required'
    });
  } else if (confirmation !== 'DELETE_MY_ACCOUNT') {
    errors.push({
      field: 'confirmation',
      message: 'Please type "DELETE_MY_ACCOUNT" to confirm account deletion'
    });
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: {
        errors: errors
      }
    });
  }

  next();
};

module.exports = {
  validateJobInterests,
  validateJobApplication,
  validateSearchParams,
  validateSaveJob,
  validateFollowCompany,
  validateJobAlert,
  validatePasswordChange,
  validateAccountDeletion
};