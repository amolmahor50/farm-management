import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchYields = async (params = {}) => {
  const response = await API.get("/yields", { params });
  return response.data;
};

const getYieldById = async (id) => {
  const response = await API.get(`/yields/${id}`);
  return response.data;
};

const createYield = async (data) => {
  const response = await API.post("/yields", data);
  return response.data;
};

const updateYield = async ({ id, ...data }) => {
  const response = await API.put(`/yields/${id}`, data);
  return response.data;
};

const deleteYield = async (id) => {
  const response = await API.delete(`/yields/${id}`);
  return response.data;
};

export const useYields = (params = {}) => {
  return useQuery({
    queryKey: ["yields", params],
    queryFn: () => fetchYields(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useYield = (id) => {
  return useQuery({
    queryKey: ["yield", id],
    queryFn: () => getYieldById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateYield = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createYield,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yields"] });
    },
  });
};

export const useUpdateYield = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateYield,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yields"] });
    },
  });
};

export const useDeleteYield = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteYield,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yields"] });
    },
  });
};
