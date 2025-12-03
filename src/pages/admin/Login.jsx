import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await authAPI.adminLogin(
      formData.email,
      formData.password
    );

    console.log("Admin login response:", response);

    if (response.success) {
      const { token, admin } = response.data || {};

      if (!token) {
        throw new Error("No token returned from admin login");
      }

      // Token cho axios (Authorization: Bearer ...)
      localStorage.setItem("token", token);
      // Flag cho AdminProtectedRoute
      localStorage.setItem("adminToken", token);
      if (admin) {
        localStorage.setItem("adminUser", JSON.stringify(admin));
      }

      navigate("/admin/dashboard");
    } else {
      setError(response.message || "Login failed");
    }
  } catch (err) {
    console.error("Admin login error:", err);
    setError(
      err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-dark">
            JobMatch Admin
          </h1>
          <p className="text-neutral-medium mt-2">Admin Portal Login</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-subtle border border-neutral-light">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="admin@jobmatch.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-brand-blue hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
