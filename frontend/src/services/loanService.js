import { API } from "@/app/CustomAxios";

export const getAllLoans = async (params = {}) => {
  const response = await API.get("/loans", { params });
  return response.data;
};

export const getLoan = async (id) => {
  const response = await API.get(`/loans/${id}`);
  return response.data;
};

export const createLoan = async (data) => {
  const response = await API.post("/loans", data);
  return response.data;
};

export const updateLoan = async (id, data) => {
  const response = await API.put(`/loans/${id}`, data);
  return response.data;
};

export const deleteLoan = async (id) => {
  const response = await API.delete(`/loans/${id}`);
  return response.data;
};

export const recordEMIPayment = async (loanId, data) => {
  const response = await API.post(`/loans/${loanId}/emi`, data);
  return response.data;
};

export const getUpcomingEMIs = async () => {
  const response = await API.get("/loans/upcoming-emi");
  return response.data;
};
