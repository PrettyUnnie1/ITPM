import { useState, useEffect } from "react";
import { jobSeekerAPI } from "../services/api";

function ApplyJobModal({ isOpen, onClose, jobId, jobTitle }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen]);

  const fetchResumes = async () => {
    try {
      setFetchingResumes(true);
      const response = await jobSeekerAPI.getResumes();
      const resumeList = response.data || [];
      setResumes(resumeList);
      // Auto-select default resume if available
      const defaultResume = resumeList.find((r) => r.isDefault);
      if (defaultResume) {
        setSelectedResumeId(defaultResume._id);
      } else if (resumeList.length > 0) {
        setSelectedResumeId(resumeList[0]._id);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setFetchingResumes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedResumeId) {
      alert("Please select a CV");
      return;
    }

    try {
      setLoading(true);
      await jobSeekerAPI.applyForJob(jobId, {
        resumeId: selectedResumeId,
        coverLetter: coverLetter.trim() || undefined,
      });
      alert("Application submitted successfully!");
      onClose();
      // Optionally redirect or refresh
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <p className="text-lg font-semibold text-gray-900">{jobTitle}</p>
          </div>

          {/* CV Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CV <span className="text-red-500">*</span>
            </label>
            {fetchingResumes ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  You don't have any CVs uploaded yet.
                </p>
                <a
                  href="/cv-manager"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Upload CV →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <label
                    key={resume._id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedResumeId === resume._id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resume"
                      value={resume._id}
                      checked={selectedResumeId === resume._id}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {resume.fileName || resume.name || "Untitled"}
                        </span>
                        {resume.isDefault && (
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded{" "}
                        {new Date(
                          resume.uploadedAt || resume.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Tell the employer why you're a great fit for this position..."
            />
            <p className="text-sm text-gray-500 mt-2">
              {coverLetter.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedResumeId || fetchingResumes}
              className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-colors ${
                loading || !selectedResumeId || fetchingResumes
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJobModal;
