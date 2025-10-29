import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getAllExpenses,
  createExpense,
  updateExpense as updateExpenseAPI,
  deleteExpense,
  getExpenseStats,
} from "@/services/expenseService";
import { toastSuccess } from "../utils/toast";

const ExpenseContext = createContext();
export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllExpenses();
      const validList = Array.isArray(data?.data) ? data.data : [];
      // Always sort by date (latest first)
      // console.log(data.data);

      setExpenses(
        validList.sort(
          (a, b) =>
            new Date(b?.updatedAt || 0).getTime() -
            new Date(a?.updatedAt || 0).getTime()
        )
      );
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await getExpenseStats();
      setStats(data || null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err);
    }
  }, []);

  // ✅ Add expense (instant + real update)
  const addExpense = async (expenseData) => {
    const now = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;

    // Ensure all fields present for UI immediately
    const optimisticExpense = {
      _id: tempId,
      date: expenseData.date || now,
      category: expenseData.category || "other",
      amount: Number(expenseData.amount) || 0,
      description: expenseData.description?.trim() || "",
      paymentMethod: expenseData.paymentMethod || "cash",
    };

    // Add temporary item immediately
    setExpenses((prev) => [optimisticExpense, ...prev]);

    try {
      const response = await createExpense(expenseData);
      const newExpense = response?.data || response;

      // Replace temp expense with real one
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === tempId ? newExpense : exp))
      );

      toastSuccess("Expense added successfully!");
      return newExpense;
    } catch (err) {
      // Revert if failed
      setExpenses((prev) => prev.filter((exp) => exp._id !== tempId));
      console.error("Error creating expense:", err);
      setError(err);
      throw err;
    }
  };

  // ✅ Update expense (instant + sync)
  const updateExpense = async (id, expenseData) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === id ? { ...exp, ...expenseData } : exp))
    );
    try {
      const updated = await updateExpenseAPI(id, expenseData);
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? { ...exp, ...updated } : exp))
      );
      toastSuccess("Expense updated successfully!");
      return updated;
    } catch (err) {
      await fetchExpenses(); // reload to restore correct data
      setError(err);
      throw err;
    }
  };

  // ✅ Delete expense (instant remove)
  const removeExpense = async (id) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    try {
      await deleteExpense(id);
      toastSuccess("Expense deleted successfully!");
    } catch (err) {
      setExpenses(previous);
      console.error("Error deleting expense:", err);
      setError(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [fetchExpenses, fetchStats]);

  const value = {
    expenses,
    stats,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    removeExpense,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
