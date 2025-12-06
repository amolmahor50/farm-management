import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

// Fetch all expenses
const fetchExpenses = async (params = {}) => {
  const response = await API.get("/expenses", { params });
  return response.data;
};

// Create expense
const createExpense = async (data) => {
  const response = await API.post("/expenses", data);
  return response.data;
};

// Update expense
const updateExpense = async ({ id, ...data }) => {
  const response = await API.put(`/expenses/${id}`, data);
  return response.data;
};

// Delete expense
const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

// Get expense by ID
const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const useExpenses = (params = {}) => {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => fetchExpenses(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useExpense = (id) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => getExpenseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
