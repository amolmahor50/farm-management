import { API } from "@/app/CustomAxios";

export const getDashboardSummary = async (params = {}) => {
  const response = await API.get("/dashboard/summary", { params });
  return response.data;
};

export const quickAddExpense = async (data) => {
  const response = await API.post("/dashboard/quick-add/expense", data);
  return response.data;
};

export const quickAddYield = async (data) => {
  const response = await API.post("/dashboard/quick-add/yield", data);
  return response.data;
};

export const quickAddLoan = async (data) => {
  const response = await API.post("/dashboard/quick-add/loan", data);
  return response.data;
};

export const getChartData = async (params) => {
  const response = await API.get("/dashboard/charts", { params });
  return response.data;
};
