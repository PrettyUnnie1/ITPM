import { Routes, Route } from "react-router-dom";
import EmployerLayout from "../layouts/EmployerLayout";
import EmployerLogin from "../pages/employer/Login";
import EmployerDashboard from "../pages/employer/Dashboard";
import CompanyProfile from "../pages/employer/CompanyProfile";
import Jobs from "../pages/employer/Jobs";

function EmployerRoutes() {
  return (
    <Routes>
      <Route path="login" element={<EmployerLogin />} />
      <Route element={<EmployerLayout />}>
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>
    </Routes>
  );
}

export default EmployerRoutes;
