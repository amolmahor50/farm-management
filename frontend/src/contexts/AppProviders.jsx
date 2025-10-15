import { AuthProvider } from "./AuthContext";

const contexts = [[AuthProvider]];

export const AppProviders = ({ children }) => {
  return contexts.reduceRight(
    (acc, [Provider, props]) => <Provider {...(props || {})}>{acc}</Provider>,
    children
  );
};
