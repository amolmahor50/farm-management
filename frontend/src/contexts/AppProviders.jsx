import { AuthProvider } from "./AuthContext";
import { ExpenseProvider } from "./ExpenseContext";
import { TaskProvider } from "./TaskContext";

const contexts = [[AuthProvider], [TaskProvider], [ExpenseProvider]];

export const AppProviders = ({ children }) => {
  return contexts.reduceRight(
    (acc, [Provider, props]) => <Provider {...(props || {})}>{acc}</Provider>,
    children
  );
};
