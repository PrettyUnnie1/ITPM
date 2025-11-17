import { Routes, Route } from "react-router-dom";
import CandidateLayout from "../layouts/CandidateLayout";
import CandidateLogin from "../pages/candidate/Login";
import JobDetail from "../pages/candidate/JobDetail";
import Profile from "../pages/candidate/Profile";

function CandidateRoutes() {
  return (
    <Routes>
      <Route path="login" element={<CandidateLogin />} />
      <Route element={<CandidateLayout />}>
        <Route path="" element={<CandidateHome />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default CandidateRoutes;
