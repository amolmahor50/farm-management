import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchExperts = async (params = {}) => {
  const response = await API.get("/experts", { params });
  return response.data;
};

const getExpertById = async (id) => {
  const response = await API.get(`/experts/${id}`);
  return response.data;
};

const createExpert = async (data) => {
  const response = await API.post("/experts", data);
  return response.data;
};

const updateExpert = async ({ id, ...data }) => {
  const response = await API.put(`/experts/${id}`, data);
  return response.data;
};

const deleteExpert = async (id) => {
  const response = await API.delete(`/experts/${id}`);
  return response.data;
};

export const useExperts = (params = {}) => {
  return useQuery({
    queryKey: ["experts", params],
    queryFn: () => fetchExperts(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useExpert = (id) => {
  return useQuery({
    queryKey: ["expert", id],
    queryFn: () => getExpertById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateExpert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
};

export const useUpdateExpert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
};

export const useDeleteExpert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
};
