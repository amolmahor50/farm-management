import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getAllYields,
  getYield,
  createYield,
  updateYield,
  deleteYield,
  getCropSummary,
} from "@/services/yieldService";
import { toastSuccess, toastError } from "../utils/toast";

const YieldContext = createContext();

export const YieldProvider = ({ children }) => {
  const [yields, setYields] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all yields
  const fetchYields = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getAllYields(params);
      setYields(res.data || res);
    } catch (err) {
      console.error("Error fetching yields:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch crop summary
  const fetchCropSummary = useCallback(async () => {
    try {
      const res = await getCropSummary();
      setSummary(res.data || res);
    } catch (err) {
      console.error("Error fetching crop summary:", err);
    }
  }, []);

  // Create new yield
  const addYield = async (data) => {
    try {
      const res = await createYield(data);
      const newYield = res.data || res;
      setYields((prev) => [newYield, ...prev]);
      toastSuccess("Yield added successfully");
      await fetchCropSummary(); //  refresh summary
      return newYield;
    } catch (err) {
      console.error("Error creating yield:", err);
      throw err;
    }
  };

  // Update existing yield
  const editYield = async (id, data) => {
    try {
      const res = await updateYield(id, data);
      const updated = res.data || res;
      setYields((prev) =>
        prev.map((y) => (y._id === id ? { ...y, ...updated } : y))
      );
      toastSuccess("Yield updated successfully");
      await fetchCropSummary(); //  refresh summary
      return updated;
    } catch (err) {
      console.error("Error updating yield:", err);
      throw err;
    }
  };

  // Delete yield
  const removeYield = async (id) => {
    try {
      await deleteYield(id);
      setYields((prev) => prev.filter((y) => y._id !== id));
      toastSuccess("Yield deleted successfully");
      await fetchCropSummary(); //  refresh summary
    } catch (err) {
      console.error("Error deleting yield:", err);
      throw err;
    }
  };

  // Get single yield by ID
  const getYieldById = async (id) => {
    try {
      const res = await getYield(id);
      return res.data || res;
    } catch (err) {
      console.error("Error fetching yield:", err);
      throw err;
    }
  };

  const value = {
    yields,
    summary,
    loading,
    fetchYields,
    fetchCropSummary,
    addYield,
    editYield,
    removeYield,
    getYieldById,
  };

  return (
    <YieldContext.Provider value={value}>{children}</YieldContext.Provider>
  );
};

export const useYields = () => {
  const context = useContext(YieldContext);
  if (!context) {
    throw new Error("useYields must be used within a YieldProvider");
  }
  return context;
};
