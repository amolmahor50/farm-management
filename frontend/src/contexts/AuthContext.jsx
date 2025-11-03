import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe, logoutUser } from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("mobile"); // mobile → otp → userDetails
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // current route

  const logout = () => {
    logoutUser();
    setUser(null);
    setStep("mobile");
    navigate("/"); // Go to login
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsAuthenticated(true);

    getMe()
      .then((res) => {
        if (res?.success) {
          const fetchedUser = res.data;

          console.log(fetchedUser);

          setUser(fetchedUser);

          //  Check if user is active and subscription is active
          if (!fetchedUser.isActive || !fetchedUser.subscription?.isActive) {
            logout();
            return;
          }

          // If user details missing, go to userDetails step
          if (!fetchedUser.name || !fetchedUser.name) {
            return setStep("userDetails");
          }

          // Only redirect to dashboard if user is on login/root route
          if (location.pathname === "/") {
            navigate("/dashboard", { replace: true });
          }
        } else {
          logout();
        }
      })
      .catch((err) => {
        console.error("Get Me failed:", err);
        logout();
      })
      .finally(() => setIsAuthenticated(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        step,
        setStep,
        isLoading,
        setIsLoading,
        isAuthenticated,
        mobile,
        setMobile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
