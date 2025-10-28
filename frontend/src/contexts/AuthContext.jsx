import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("mobile"); // mobile → otp → userDetails
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // current route

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setStep("mobile");
    navigate("/"); // Go to login
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);

    getMe()
      .then((res) => {
        if (res?.success) {
          const fetchedUser = res.data;
          setUser(fetchedUser);

          // If user details missing, go to userDetails step
          if (!fetchedUser.name || !fetchedUser.name) {
            return setStep("userDetails");
          }

          // ✅ Only redirect to dashboard if user is on login/root route
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
      .finally(() => setIsLoading(false));
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
