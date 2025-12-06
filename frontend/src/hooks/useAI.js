import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchAIData = async (params = {}) => {
  const response = await API.get("/ai", { params });
  return response.data;
};

const getAIDataById = async (id) => {
  const response = await API.get(`/ai/${id}`);
  return response.data;
};

const predictYield = async (data) => {
  const response = await API.post("/ai/predict-yield", data);
  return response.data;
};

const predictProfit = async (data) => {
  const response = await API.post("/ai/predict-profit", data);
  return response.data;
};

const optimizeExpenses = async (data) => {
  const response = await API.post("/ai/optimize-expenses", data);
  return response.data;
};

const recommendCrop = async (data) => {
  const response = await API.post("/ai/recommend-crop", data);
  return response.data;
};

const analyzePestRisk = async (data) => {
  const response = await API.post("/ai/analyze-pest-risk", data);
  return response.data;
};

export const useAIHistory = (params = {}) => {
  return useQuery({
    queryKey: ["ai-history", params],
    queryFn: () => fetchAIData(params),
    staleTime: 1000 * 60 * 10,
  });
};

export const useAIData = (id) => {
  return useQuery({
    queryKey: ["ai-data", id],
    queryFn: () => getAIDataById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const usePredictYield = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: predictYield,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
    },
  });
};

export const usePredictProfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: predictProfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
    },
  });
};

export const useOptimizeExpenses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: optimizeExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
    },
  });
};

export const useRecommendCrop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recommendCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
    },
  });
};

export const useAnalyzePestRisk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: analyzePestRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-history"] });
    },
  });
};
