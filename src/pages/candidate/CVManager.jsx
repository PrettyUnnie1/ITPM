import { useState } from "react";

function CVManager() {
  const [isDragging, setIsDragging] = useState(false);

  const mockResumes = [
    {
      id: 1,
      name: "Frontend_Developer_CV.pdf",
      uploadDate: "2025-11-10",
      isDefault: true,
      size: "245 KB",
    },
    {
      id: 2,
      name: "Senior_React_Developer.pdf",
      uploadDate: "2025-10-15",
      isDefault: false,
      size: "198 KB",
    },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // TODO: Handle file upload
    console.log("Files dropped:", e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    // TODO: Handle file upload
    console.log("Files selected:", e.target.files);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("cv.title")}</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your CVs for job applications
          </p>
        </div>
      </div>

      {/* API Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              API Integration Pending
            </h4>
            <p className="text-sm text-blue-700">
              {t("common.apiPlaceholder")}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`card p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-2 border-primary-500 bg-primary-50"
            : "border-2 border-dashed border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {t("cv.dragDrop")}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {t("cv.supportedFormats")}
          </p>
          <label className="btn-primary cursor-pointer inline-block">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              multiple
            />
            {t("cv.upload")}
          </label>
        </div>
      </div>

      {/* My Resumes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t("cv.myResumes")}
          </h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            {t("cv.create")} →
          </button>
        </div>

        <div className="space-y-4">
          {mockResumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {resume.name}
                    </h3>
                    {resume.isDefault && (
                      <span className="badge badge-primary text-xs">
                        {t("cv.defaultCV")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploaded on {resume.uploadDate} • {resume.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors duration-200"
                  title={t("cv.preview")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors duration-200"
                  title={t("cv.download")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
                {!resume.isDefault && (
                  <button
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors duration-200"
                    title={t("cv.setDefault")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                  title={t("cv.delete")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">
              Tips for a great CV
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Keep your CV concise and relevant (1-2 pages)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>
                  Highlight your achievements with quantifiable results
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Tailor your CV for each job application</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Use PDF format for compatibility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVManager;
