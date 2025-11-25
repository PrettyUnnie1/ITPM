import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Preserve the original error structure for better error handling
    return Promise.reject(error);
  }
);

// ============= AUTH API =============

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updatePassword: (data) => api.put("/auth/password", data),
};

// ============= ADMIN API =============

export const adminAPI = {
  login: (data) => api.post("/admin/login", data),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  verifyCompany: (id, data) => api.patch(`/admin/company/${id}/verify`, data),
  getReports: (params) => api.get("/admin/reports", { params }),
  updateReportStatus: (id, data) => api.patch(`/admin/reports/${id}`, data),
  getStats: () => api.get("/admin/stats"),
};

// ============= EMPLOYER API =============

export const employerAPI = {
  // Company Profile
  createCompanyProfile: (data) => api.post("/employer/profile", data),
  getMyCompanyProfile: () => api.get("/employer/profile"),
  updateCompanyProfile: (data) => api.put("/employer/profile", data),

  // Jobs
  postJob: (data) => api.post("/employer/jobs", data),
  getMyJobs: (params) => api.get("/employer/jobs", { params }),
  getJobById: (id) => api.get(`/employer/jobs/${id}`),
  updateJob: (id, data) => api.put(`/employer/jobs/${id}`, data),
  updateJobStatus: (id, data) => api.patch(`/employer/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/employer/jobs/${id}`),

  // Applicants
  getJobApplicants: (jobId, params) =>
    api.get(`/employer/jobs/${jobId}/applicants`, { params }),
  updateApplicationStatus: (id, data) =>
    api.patch(`/employer/applications/${id}/status`, data),

  // Stats
  getStats: () => api.get("/employer/stats"),
};

// ============= JOB SEEKER API =============

export const jobSeekerAPI = {
  // Profile Management
  getMyProfile: () => api.get("/js/profile"),
  updateBasicInfo: (data) => api.patch("/js/profile/general", data),
  updateSummary: (data) => api.put("/js/profile/summary", data),
  updateSkills: (data) => api.put("/js/profile/skills", data),
  updateInterests: (data) => api.put("/js/profile/interests", data),

  // Experience
  addExperience: (data) => api.post("/js/profile/experiences", data),
  updateExperience: (id, data) =>
    api.put(`/js/profile/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/js/profile/experiences/${id}`),

  // Education
  addEducation: (data) => api.post("/js/profile/education", data),
  updateEducation: (id, data) => api.put(`/js/profile/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/js/profile/education/${id}`),

  // Certificates
  addCertificate: (data) => api.post("/js/profile/certificates", data),
  updateCertificate: (id, data) =>
    api.put(`/js/profile/certificates/${id}`, data),
  deleteCertificate: (id) => api.delete(`/js/profile/certificates/${id}`),

  // Awards
  addAward: (data) => api.post("/js/profile/awards", data),
  updateAward: (id, data) => api.put(`/js/profile/awards/${id}`, data),
  deleteAward: (id) => api.delete(`/js/profile/awards/${id}`),

  // Others
  addOther: (data) => api.post("/js/profile/others", data),
  updateOther: (id, data) => api.put(`/js/profile/others/${id}`, data),
  deleteOther: (id) => api.delete(`/js/profile/others/${id}`),

  // Resume
  uploadResume: (formData) =>
    api.post("/js/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getResumes: () => api.get("/js/profile/resume"),
  updateResume: (id, formData) =>
    api.put(`/js/profile/resume/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteResume: (id) => api.delete(`/js/profile/resume/${id}`),

  // Jobs
  searchJobs: (params) => api.get("/js/jobs/search", { params }),
  getJobDetail: (id) => api.get(`/js/jobs/${id}`),
  getRecommendedJobs: (params) => api.get("/js/jobs/recommended", { params }),

  // Applications
  applyForJob: (jobId, data) => api.post(`/js/jobs/${jobId}/apply`, data),
  getMyApplications: (params) => api.get("/js/applications", { params }),
  getApplicationDetail: (id) => api.get(`/js/applications/${id}`),
  cancelApplication: (id) => api.delete(`/js/applications/${id}`),

  // Saved Jobs
  saveJob: (data) => api.post("/js/jobs/saved", data),
  getSavedJobs: (params) => api.get("/js/jobs/saved", { params }),
  unsaveJob: (id) => api.delete(`/js/jobs/saved/${id}`),

  // Companies
  searchCompanies: (params) => api.get("/js/companies", { params }),
  getCompanyDetail: (id) => api.get(`/js/companies/${id}`),
  getCompanyJobs: (id, params) =>
    api.get(`/js/companies/${id}/jobs`, { params }),
  followCompany: (id) => api.post(`/js/companies/${id}/follow`),
  unfollowCompany: (id) => api.delete(`/js/companies/${id}/follow`),
  getFollowingCompanies: (params) =>
    api.get("/js/companies/following", { params }),

  // Notifications
  getNotifications: (params) => api.get("/js/notifications", { params }),
  markNotificationAsRead: (id) => api.put(`/js/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.put("/js/notifications/read-all"),

  // Job Alerts
  createJobAlert: (data) => api.post("/js/alert", data),
  getJobAlerts: () => api.get("/js/alert"),
  updateJobAlert: (id, data) => api.put(`/js/alert/${id}`, data),
  deleteJobAlert: (id) => api.delete(`/js/alert/${id}`),
  toggleJobAlert: (id) => api.put(`/js/alert/${id}/toggle`),

  // Settings
  getSettings: () => api.get("/js/settings"),
  updateSettings: (data) => api.put("/js/settings", data),
  changePassword: (data) => api.put("/js/settings/password", data),
  deleteAccount: (data) => api.delete("/js/settings/account", { data }),
};

// ============= HELPER FUNCTIONS =============

export const uploadFile = async (file, type = "resume") => {
  const formData = new FormData();
  formData.append(type, file);
  return formData;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default api;
