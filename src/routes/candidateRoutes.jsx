import { Routes, Route } from "react-router-dom";
import CandidateLayout from "../layouts/CandidateLayout";
import CandidateLogin from "../pages/candidate/Login";
import CandidateRegister from "../pages/candidate/Register";
import JobDetail from "../pages/candidate/JobDetail";
import Profile from "../pages/candidate/Profile";
import Dashboard from "../pages/candidate/Dashboard";
import CVManager from "../pages/candidate/CVManager";
import JobStatus from "../pages/candidate/JobStatus";
import Companies from "../pages/candidate/Companies";
import Settings from "../pages/candidate/Settings";
import Explore from "../pages/candidate/Explore";
import Saved from "../pages/candidate/Saved";
import Home from "../pages/candidate/Home";

function CandidateRoutes() {
  return (
    <Routes>
      <Route path="login" element={<CandidateLogin />} />
      <Route path="register" element={<CandidateRegister />} />
      <Route element={<CandidateLayout />}>
        <Route path="" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="saved" element={<Saved />} />
        <Route path="companies" element={<Companies />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="job-status" element={<JobStatus />} />
        <Route path="cv-manager" element={<CVManager />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="jobs/:id" element={<JobDetail />} />
      </Route>
    </Routes>
  );
}

export default CandidateRoutes;
