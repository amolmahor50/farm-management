// src/utils/toast.js
import { toast as hotToast } from "react-hot-toast";

/**
 * Show a success toast
 * @param {string} message
 */
export const toastSuccess = (message) => {
  hotToast.success(message, {
    duration: 6500,
    position: "bottom-center",
    style: {
      fontSize: "12px",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

/**
 * Show an error toast
 * @param {string} message
 */
export const toastError = (message) => {
  hotToast.error(message, {
    duration: 6500,
    position: "bottom-center",
    style: {
      fontSize: "12px",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

/**
 * Show a custom info toast
 * @param {string} message
 */
export const toastInfo = (message) => {
  hotToast(message, {
    duration: 6500,
    position: "bottom-center",
    style: {
      fontSize: "12px",
      borderRadius: "8px",
      padding: "10px 16px",
      background: "#3b82f6",
      color: "white",
    },
  });
};
