import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/config/queryClient";

/**
 * RootProviders with React Query DevTools
 *
 * The DevTools component provides a UI for:
 * - Viewing all active queries
 * - Inspecting query data
 * - Manually refetching queries
 * - Clearing cache
 * - Viewing query history
 *
 * Usage in development:
 * 1. Click the floating React Query icon (bottom right after app loads)
 * 2. Inspect queries, mutations, and cache state
 * 3. Test cache behavior and refetching
 */
export const RootProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
};
