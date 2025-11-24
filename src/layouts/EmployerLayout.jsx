import { Outlet, Link } from "react-router-dom";

function EmployerLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Employer</h2>
        <nav>
          <Link to="/employer/dashboard">Dashboard</Link>
          <Link to="/employer/company-profile">Hồ sơ công ty</Link>
          <Link to="/employer/jobs">Tin tuyển dụng</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployerLayout;
