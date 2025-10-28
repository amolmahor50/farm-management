import { AuthProvider } from "./AuthContext";
import { TaskProvider } from "./TaskContext";

const contexts = [[AuthProvider], [TaskProvider]];

export const AppProviders = ({ children }) => {
  return contexts.reduceRight(
    (acc, [Provider, props]) => <Provider {...(props || {})}>{acc}</Provider>,
    children
  );
};
