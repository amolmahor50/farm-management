import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, logoutUser } from "@/services/authService";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Fetch current user
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }
      const res = await getMe();
      if (res?.success) {
        return res.data;
      }
      throw new Error("Failed to fetch user");
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });

  return {
    user,
    isLoading,
    isError,
    error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: !!user && !!localStorage.getItem("token"),
  };
};
