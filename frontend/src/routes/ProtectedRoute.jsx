import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, setStep } = useAuth();
  const location = useLocation();

  // No user object → redirect to login page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user exists but missing details (name/email)
  if (!user.name || !user.email) {
    return setStep("userDetails");
    // return <Navigate to="/user-details" replace />;
  }

  // User is valid → show the requested protected page
  return children;
};

export default ProtectedRoute;
