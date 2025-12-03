import { useState, useEffect } from "react";
import { employerAPI } from "../../services/api";
import { VIETNAM_CITIES, INDUSTRIES, COMPANY_SIZES } from "../../constants";

function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    logoUrl: "",
    location: "",
    description: "",
    benefits: "",
    culture: "",
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await employerAPI.getMyCompanyProfile();

      // Backend returns { success: true, message, data }
      if (response && response.data) {
        setHasProfile(true);
        const company = response.data;
        setFormData({
          companyName: company.companyName || "",
          industry: company.industry || "",
          companySize: company.companySize || "",
          website: company.website || "",
          logoUrl: company.logoUrl || "",
          location: company.city || "", // Map city to location
          description: company.description || "",
          benefits: "", // Not in backend model
          culture: "", // Not in backend model
        });
      }
    } catch (error) {
      // Nếu 404, nghĩa là chưa có profile - không phải lỗi
      if (error.response?.status === 404) {
        setHasProfile(false);
        console.log("No company profile found - ready to create new one");
      } else {
        console.error(
          "Error fetching company:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Map form data to backend model fields
      const data = {
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        website: formData.website,
        logoUrl: formData.logoUrl,
        city: formData.location, // Map location to city
        country: "Vietnam",
        description: formData.description,
        // Note: benefits and culture are not in the backend model yet
        // They will be ignored by MongoDB
      };

      console.log("Submitting company data:", data);

      let response;
      if (hasProfile) {
        response = await employerAPI.updateCompanyProfile(data);
        setMessage({
          type: "success",
          text: "Company profile updated successfully!",
        });
      } else {
        response = await employerAPI.createCompanyProfile(data);
        setMessage({
          type: "success",
          text: "Company profile created successfully!",
        });
        setHasProfile(true);
      }

      console.log("Company save response:", response);
    } catch (error) {
      console.error(
        "Error saving company:",
        error.response?.data || error.message
      );
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to save company profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl flex items-center justify-center text-3xl">
            🏢
          </div>
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-white text-opacity-90 mt-1">
              {hasProfile
                ? "Update your company information to attract top talent"
                : "Create your company profile to start posting jobs"}
            </p>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 border-2 border-green-200 text-green-800"
              : "bg-red-50 border-2 border-red-200 text-red-800"
          } animate-fade-in`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-sm space-y-8"
      >
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Size <span className="text-red-500">*</span>
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select company size</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    🏢 {size} employees
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select city...</option>
                {VIETNAM_CITIES.map((city) => (
                  <option key={city} value={city}>
                    📍 {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🎨</span>
            Company Branding
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {formData.logoUrl && (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Logo Preview
                </label>
                <img
                  src={formData.logoUrl}
                  alt="Company logo preview"
                  className="w-32 h-32 object-contain rounded-lg border-2 border-white shadow-lg bg-white"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">📝</span>
            About Your Company
          </h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Tell candidates about your company, mission, and what makes you unique..."
            />
          </div>
        </div>

        {/* Benefits & Culture */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">✨</span>
            Company Benefits & Culture
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Benefits
              </label>
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g., Health Insurance, Remote Work, Flexible Hours"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Separate multiple benefits with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Culture
              </label>
              <textarea
                name="culture"
                value={formData.culture}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Describe your company culture, values, and work environment..."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center space-x-4 pt-6 border-t-2 border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
          >
            {saving
              ? "Saving..."
              : hasProfile
              ? "✓ Update Profile"
              : "✓ Create Profile"}
          </button>

          {hasProfile && (
            <button
              type="button"
              onClick={fetchCompany}
              className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CompanyProfile;
