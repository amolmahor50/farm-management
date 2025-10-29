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
} from "@/services/yieldService";
import { toastSuccess } from "../utils/toast";

const YieldContext = createContext();

export const YieldProvider = ({ children }) => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all yields
  const fetchYields = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getAllYields(params);
      setYields(res.data || res);
      setError(null);
    } catch (err) {
      console.error("Error fetching yields:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Create new yield
  const addYield = async (data) => {
    try {
      const res = await createYield(data);
      const newYield = res.data || res;
      setYields((prev) => [newYield, ...prev]);
      toastSuccess("Yield added..");
      return newYield;
    } catch (err) {
      console.error("Error creating yield:", err);
      throw err;
    }
  };

  // ✅ Update existing yield
  const editYield = async (id, data) => {
    try {
      const res = await updateYield(id, data);
      const updated = res.data || res;
      setYields((prev) =>
        prev.map((y) => (y._id === id ? { ...y, ...updated } : y))
      );
      toastSuccess("Yield Updated..");
      return updated;
    } catch (err) {
      console.error("Error updating yield:", err);
      throw err;
    }
  };

  // ✅ Delete yield
  const removeYield = async (id) => {
    try {
      await deleteYield(id);
      setYields((prev) => prev.filter((y) => y._id !== id));
      toastSuccess("Yield Deleted..");
    } catch (err) {
      console.error("Error deleting yield:", err);
      throw err;
    }
  };

  // ✅ Get single yield by ID
  const getYieldById = async (id) => {
    try {
      const res = await getYield(id);
      return res.data || res;
    } catch (err) {
      console.error("Error fetching yield:", err);
      throw err;
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchYields();
  }, [fetchYields]);

  const value = {
    yields,
    loading,
    error,
    fetchYields,
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
