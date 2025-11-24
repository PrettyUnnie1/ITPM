import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CandidateLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
    navigate("/candidate");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-dark">JobMatch</h1>
          <p className="text-neutral-medium mt-2">{t("login.subtitle")}</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-subtle border border-neutral-light">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                {t("login.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-medium mb-1"
              >
                {t("login.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-brand-blue hover:underline"
              >
                {t("login.forgot")}
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("login.submit")}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-medium">
          {t("login.noAccount")}{" "}
          <Link
            to="/candidate/signup"
            className="font-semibold text-brand-blue hover:underline"
          >
            {t("login.signup")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CandidateLogin;
