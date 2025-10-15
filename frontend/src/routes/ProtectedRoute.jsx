import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loader while fetching user data
  if (isLoading) {
    return <Loading />;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ✅ User is logged in, render the requested page
  return children;
};

export default ProtectedRoute;
