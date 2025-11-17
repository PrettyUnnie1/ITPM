import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployerRoutes from "./routes/employerRoutes";
import CandidateRoutes from "./routes/candidateRoutes";
import AdminRoutes from "./routes/adminRoutes";
import HomePage from "./HomePage";
import CompaniesPage from "./pages/CompaniesPage";
import JobListPage from "./pages/candidate/JobListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home chung */}
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />

        {/* Job List */}
        <Route path="/jobs" element={<JobListPage />} />

        {/* Candidate */}
        <Route path="/candidate/*" element={<CandidateRoutes />} />

        {/* Employer */}
        <Route path="/employer/*" element={<EmployerRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
