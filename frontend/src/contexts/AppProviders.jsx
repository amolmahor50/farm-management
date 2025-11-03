import { AuthProvider } from "./AuthContext";
import { DashboardProvider } from "./DashboardContext";
import { ExpenseProvider } from "./ExpenseContext";
import { LoanProvider } from "./LoanContext";
import { TaskProvider } from "./TaskContext";
import { YieldProvider } from "./YieldContext";

const contexts = [
  [AuthProvider],
  // [DashboardProvider],
  [TaskProvider],
  [ExpenseProvider],
  [YieldProvider],
  [LoanProvider],
];

export const AppProviders = ({ children }) => {
  return contexts.reduceRight(
    (acc, [Provider, props]) => <Provider {...(props || {})}>{acc}</Provider>,
    children
  );
};
