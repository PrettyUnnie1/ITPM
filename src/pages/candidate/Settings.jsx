function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("nav.settings")}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
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

      {/* Account Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Account Settings
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="nguyenvana@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+84 123 456 789"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Change Password
            </label>
            <button className="btn-outline">Change Password</button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            {
              label: "Email notifications for new job matches",
              defaultValue: true,
            },
            {
              label: "SMS notifications for interview reminders",
              defaultValue: true,
            },
            { label: "Weekly job recommendations", defaultValue: true },
            { label: "Marketing emails", defaultValue: false },
          ].map((item, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900">{item.label}</span>
              <input
                type="checkbox"
                defaultChecked={item.defaultValue}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Privacy Settings
        </h2>
        <div className="space-y-4">
          {[
            {
              label: "Make my profile visible to employers",
              defaultValue: true,
            },
            {
              label: "Allow companies to contact me directly",
              defaultValue: true,
            },
            { label: "Show my application history", defaultValue: false },
          ].map((item, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900">{item.label}</span>
              <input
                type="checkbox"
                defaultChecked={item.defaultValue}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-900 mb-6">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-red-900">Deactivate Account</h3>
              <p className="text-sm text-red-700">
                Temporarily disable your account
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
              Deactivate
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button className="btn-outline">Cancel</button>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}

export default Settings;
