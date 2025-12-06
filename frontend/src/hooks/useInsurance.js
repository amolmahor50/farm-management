import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchInsurance = async (params = {}) => {
  const response = await API.get("/insurance", { params });
  return response.data;
};

const getInsuranceById = async (id) => {
  const response = await API.get(`/insurance/${id}`);
  return response.data;
};

const createInsurance = async (data) => {
  const response = await API.post("/insurance", data);
  return response.data;
};

const updateInsurance = async ({ id, ...data }) => {
  const response = await API.put(`/insurance/${id}`, data);
  return response.data;
};

const deleteInsurance = async (id) => {
  const response = await API.delete(`/insurance/${id}`);
  return response.data;
};

const claimInsurance = async ({ id, ...data }) => {
  const response = await API.post(`/insurance/${id}/claim`, data);
  return response.data;
};

export const useInsurance = (params = {}) => {
  return useQuery({
    queryKey: ["insurance", params],
    queryFn: () => fetchInsurance(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useInsuranceById = (id) => {
  return useQuery({
    queryKey: ["insurance", id],
    queryFn: () => getInsuranceById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
    },
  });
};

export const useUpdateInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
    },
  });
};

export const useDeleteInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
    },
  });
};

export const useClaimInsurance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimInsurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
    },
  });
};
