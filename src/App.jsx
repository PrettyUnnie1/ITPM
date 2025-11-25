import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import EmployerRoutes from "./routes/employerRoutes";
import AdminRoutes from "./routes/adminRoutes";
import HomePage from "./HomePage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetails from "./pages/CompanyDetails";
import PublicJobSearch from "./pages/PublicJobSearch";
import PublicJobDetail from "./pages/PublicJobDetail";
import CandidateLogin from "./pages/candidate/Login";
import CandidateRegister from "./pages/candidate/Register";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/candidate/Profile";
import Settings from "./pages/candidate/Settings";
import CVManager from "./pages/candidate/CVManager";
import JobStatus from "./pages/candidate/JobStatus";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages for Candidates (Job Seekers) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<PublicJobSearch />} />
          <Route path="/jobs/:id" element={<PublicJobDetail />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/login" element={<CandidateLogin />} />
          <Route path="/register" element={<CandidateRegister />} />

          {/* Protected Candidate Routes */}
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cv" element={<CVManager />} />
          <Route path="/applications" element={<JobStatus />} />
          <Route path="/settings" element={<Settings />} />

          {/* Employer Portal */}
          <Route path="/employer/*" element={<EmployerRoutes />} />

          {/* Admin Portal */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
