import { useQuery } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchDashboardSummary = async (params = {}) => {
  const response = await API.get("/dashboard/summary", { params });
  return response.data;
};

const fetchDashboardChartData = async (params = {}) => {
  const response = await API.get("/dashboard/charts", { params });
  return response.data;
};

const fetchDashboardStats = async (params = {}) => {
  const response = await API.get("/dashboard/stats", { params });
  return response.data;
};

export const useDashboardSummary = (params = {}) => {
  return useQuery({
    queryKey: ["dashboard-summary", params],
    queryFn: () => fetchDashboardSummary(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDashboardCharts = (params = {}) => {
  return useQuery({
    queryKey: ["dashboard-charts", params],
    queryFn: () => fetchDashboardChartData(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDashboardStats = (params = {}) => {
  return useQuery({
    queryKey: ["dashboard-stats", params],
    queryFn: () => fetchDashboardStats(params),
    staleTime: 1000 * 60 * 5,
  });
};
