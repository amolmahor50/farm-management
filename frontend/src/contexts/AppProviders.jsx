import { AuthProvider } from "./AuthContext";
import { ExpenseProvider } from "./ExpenseContext";
import { TaskProvider } from "./TaskContext";
import { YieldProvider } from "./YieldContext";

const contexts = [
  [AuthProvider],
  [TaskProvider],
  [ExpenseProvider],
  [YieldProvider],
];

export const AppProviders = ({ children }) => {
  return contexts.reduceRight(
    (acc, [Provider, props]) => <Provider {...(props || {})}>{acc}</Provider>,
    children
  );
};
