import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Still loading → show nothing (App.jsx handles loading state)
  if (isLoading) {
    return null;
  }

  // No user or not authenticated → redirect to login page
  if (!user || !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // User is valid → show the requested protected page
  return children;
};

export default ProtectedRoute;
