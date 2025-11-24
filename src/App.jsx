import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployerRoutes from "./routes/employerRoutes";
import CandidateRoutes from "./routes/candidateRoutes";
import AdminRoutes from "./routes/adminRoutes";
import HomePage from "./HomePage";
import CompaniesPage from "./pages/CompaniesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home chung */}
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />

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
