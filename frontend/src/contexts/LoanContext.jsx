import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getAllLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
  recordEMIPayment,
  getUpcomingEMIs,
} from "@/services/loanService";
import { toastSuccess } from "../utils/toast";

// Create Context
const LoanContext = createContext();

// Provider
export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [upcomingEMIs, setUpcomingEMIs] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**  Fetch all loans */
  const fetchLoans = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await getAllLoans(params);
      const data = res?.data || res; // handle direct array or object
      setLoans(Array.isArray(data) ? data : data?.loans || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**  Fetch single loan */
  const fetchLoan = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const data = await getLoan(id);
      setSelectedLoan(data || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**  Add new loan */
  const addLoan = async (data) => {
    setIsLoading(true);
    try {
      const newLoan = await createLoan(data);
      setLoans((prev) => [...prev, newLoan]);
      toastSuccess("Loan added successfully.");
      return newLoan;
    } finally {
      setIsLoading(false);
    }
  };

  /**  Edit existing loan */
  const editLoan = async (id, data) => {
    setIsLoading(true);
    try {
      const updated = await updateLoan(id, data);
      setLoans((prev) =>
        prev.map((loan) => (loan._id === id ? updated : loan))
      );
      toastSuccess("Loan updated successfully.");
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  /**  Delete loan */
  const removeLoan = async (id) => {
    setIsLoading(true);
    try {
      await deleteLoan(id);
      setLoans((prev) => prev.filter((loan) => loan._id !== id));
      toastSuccess("Loan deleted successfully.");
    } finally {
      setIsLoading(false);
    }
  };

  /**  Record EMI Payment */
  const payEMI = async (loanId, data) => {
    setIsLoading(true);
    try {
      const updatedLoan = await recordEMIPayment(loanId, data);
      setLoans((prev) =>
        prev.map((loan) => (loan._id === loanId ? updatedLoan : loan))
      );
      toastSuccess("EMI payment recorded successfully.");
      return updatedLoan;
    } finally {
      setIsLoading(false);
    }
  };

  /**  Fetch upcoming EMIs */
  const fetchUpcomingEMIs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUpcomingEMIs();
      setUpcomingEMIs(Array.isArray(data) ? data : data?.emIs || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return (
    <LoanContext.Provider
      value={{
        loans,
        selectedLoan,
        upcomingEMIs,
        isLoading,
        fetchLoans,
        fetchLoan,
        addLoan,
        editLoan,
        removeLoan,
        payEMI,
        fetchUpcomingEMIs,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) throw new Error("useLoan must be used within a LoanProvider");
  return context;
};
