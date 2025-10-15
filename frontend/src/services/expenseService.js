import { API } from "@/app/CustomAxios";

export const getAllExpenses = async (params = {}) => {
  const response = await API.get("/expenses", { params });
  return response.data;
};

export const getExpense = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const createExpense = async (data) => {
  const response = await API.post("/expenses", data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await API.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

export const getExpenseStats = async () => {
  const response = await API.get("/expenses/stats");
  return response.data;
};
