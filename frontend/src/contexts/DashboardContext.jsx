import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getDashboardSummary, getChartData } from "@/services/dashboardService"; // adjust path as per your folder

// Create Context
const DashboardContext = createContext();

// Provider Component
export const DashboardProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch Dashboard Summary
  const fetchSummary = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await getDashboardSummary(params);
      console.log("📊 Dashboard Summary:", res.data);
      setSummary(res?.data);
    } catch (err) {
      console.error("❌ Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 📈 Fetch Chart Data
  const fetchChartData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const data = await getChartData(params);
      console.log("📊 Chart Data:", data);
      setChartData(data);
    } catch (err) {
      console.error("❌ Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🧠 Auto load summary on mount
  useEffect(() => {
    fetchSummary();
    fetchChartData();
  }, [fetchSummary, fetchChartData]);

  // 🧾 Console all data whenever state updates (for debugging)
  useEffect(() => {
    console.log("🧾 Dashboard Context Updated:");
    console.log({
      summary,
      chartData,
      loading,
    });
  }, [summary, chartData, loading]);

  // Provide all data + methods
  const value = {
    summary,
    chartData,
    loading,
    fetchSummary,
    fetchChartData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom Hook for easy use
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
