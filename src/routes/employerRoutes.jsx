import { Routes, Route } from "react-router-dom";
import EmployerLayout from "../layouts/EmployerLayout";
import EmployerLogin from "../pages/employer/Login";
import EmployerRegister from "../pages/employer/Register";
import EmployerDashboard from "../pages/employer/Dashboard";
import CompanyProfile from "../pages/employer/CompanyProfile";
import JobsNew from "../pages/employer/JobsNew";

function EmployerRoutes() {
  return (
    <Routes>
      <Route path="login" element={<EmployerLogin />} />
      <Route path="register" element={<EmployerRegister />} />
      <Route element={<EmployerLayout />}>
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="jobs" element={<JobsNew />} />
      </Route>
    </Routes>
  );
}

export default EmployerRoutes;
