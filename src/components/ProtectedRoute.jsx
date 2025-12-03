import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page
    if (requiredRole === "employer") {
      return <Navigate to="/employer/login" replace />;
    } else if (requiredRole === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/candidate/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard if wrong role
    if (user?.role === "js") {
      return <Navigate to="/candidate/dashboard" replace />;
    } else if (user?.role === "employer") {
      return <Navigate to="/employer/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
