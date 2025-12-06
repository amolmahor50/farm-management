import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchMarket = async (params = {}) => {
  const response = await API.get("/market", { params });
  return response.data;
};

const getMarketById = async (id) => {
  const response = await API.get(`/market/${id}`);
  return response.data;
};

const createMarketListing = async (data) => {
  const response = await API.post("/market", data);
  return response.data;
};

const updateMarketListing = async ({ id, ...data }) => {
  const response = await API.put(`/market/${id}`, data);
  return response.data;
};

const deleteMarketListing = async (id) => {
  const response = await API.delete(`/market/${id}`);
  return response.data;
};

export const useMarket = (params = {}) => {
  return useQuery({
    queryKey: ["market", params],
    queryFn: () => fetchMarket(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMarketItem = (id) => {
  return useQuery({
    queryKey: ["market", id],
    queryFn: () => getMarketById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateMarketListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMarketListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market"] });
    },
  });
};

export const useUpdateMarketListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMarketListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market"] });
    },
  });
};

export const useDeleteMarketListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMarketListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market"] });
    },
  });
};
