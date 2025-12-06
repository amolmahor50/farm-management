import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchLoans = async (params = {}) => {
  const response = await API.get("/loans", { params });
  return response.data;
};

const getLoanById = async (id) => {
  const response = await API.get(`/loans/${id}`);
  return response.data;
};

const createLoan = async (data) => {
  const response = await API.post("/loans", data);
  return response.data;
};

const updateLoan = async ({ id, ...data }) => {
  const response = await API.put(`/loans/${id}`, data);
  return response.data;
};

const deleteLoan = async (id) => {
  const response = await API.delete(`/loans/${id}`);
  return response.data;
};

const approveLoan = async (id) => {
  const response = await API.patch(`/loans/${id}/approve`);
  return response.data;
};

export const useLoans = (params = {}) => {
  return useQuery({
    queryKey: ["loans", params],
    queryFn: () => fetchLoans(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLoan = (id) => {
  return useQuery({
    queryKey: ["loan", id],
    queryFn: () => getLoanById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};

export const useApproveLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
