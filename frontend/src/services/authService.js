import { API } from "@/app/CustomAxios";

/** 1. Send OTP for login */
export const sendLoginOTP = async (phone) => {
  const { data } = await API.post("/auth/send-otp", { phone });
  return data;
};

/** 2. Verify OTP for login */
export const verifyLoginOTP = async (phone, otp) => {
  const { data } = await API.post("/auth/verify-otp", { phone, otp });

  if (
    data?.user?.isActive ||
    data?.user?.subscription?.isActive ||
    data?.token
  )
    localStorage.setItem("token", data.token);
  return data;
};

/** 3. Register new user */
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

/** 4. Verify OTP for registration */
export const verifyRegistration = async (phone, otp) => {
  const { data } = await API.post("/auth/verify-registration", { phone, otp });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
};

/** 5. Check if user exists */
export const checkUserExists = async (phone) => {
  const { data } = await API.get(`/auth/check/${phone}`);
  return data;
};

/** 6. Get current logged-in user */
export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

/** 7. Logout user */
export const logoutUser = () => {
  localStorage.removeItem("token");
  return { success: true, message: "Logged out successfully" };
};
