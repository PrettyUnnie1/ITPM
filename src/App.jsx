import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

// Route bảo vệ cho CANDIDATE (job seeker)
function CandidateProtectedRoute() {
  const { user, loading } = useAuth();

  // Nếu context vẫn đang load (ví dụ check token) thì có thể show skeleton
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu chưa đăng nhập thì đá về trang login của candidate
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

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
          <Route element={<CandidateProtectedRoute />}>
            <Route path="/saved" element={<SavedJobs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cv" element={<CVManager />} />
            <Route path="/applications" element={<JobStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Employer Portal */}
          <Route path="/employer/*" element={<EmployerRoutes />} />

          {/* Admin Portal (tách riêng, không dùng CandidateProtectedRoute) */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* fallback nếu path không khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
