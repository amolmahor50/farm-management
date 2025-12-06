import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchKnowledge = async (params = {}) => {
  const response = await API.get("/knowledge", { params });
  return response.data;
};

const getKnowledgeById = async (id) => {
  const response = await API.get(`/knowledge/${id}`);
  return response.data;
};

const createKnowledge = async (data) => {
  const response = await API.post("/knowledge", data);
  return response.data;
};

const updateKnowledge = async ({ id, ...data }) => {
  const response = await API.put(`/knowledge/${id}`, data);
  return response.data;
};

const deleteKnowledge = async (id) => {
  const response = await API.delete(`/knowledge/${id}`);
  return response.data;
};

export const useKnowledge = (params = {}) => {
  return useQuery({
    queryKey: ["knowledge", params],
    queryFn: () => fetchKnowledge(params),
    staleTime: 1000 * 60 * 10,
  });
};

export const useKnowledgeItem = (id) => {
  return useQuery({
    queryKey: ["knowledge", id],
    queryFn: () => getKnowledgeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
};

export const useUpdateKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
};

export const useDeleteKnowledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
};
