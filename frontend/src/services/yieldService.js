import { API } from "@/app/CustomAxios";

export const getAllYields = async (params = {}) => {
  const response = await API.get("/yields", { params });
  return response.data;
};

export const getYield = async (id) => {
  const response = await API.get(`/yields/${id}`);
  return response.data;
};

export const createYield = async (data) => {
  const response = await API.post("/yields", data);
  return response.data;
};

export const updateYield = async (id, data) => {
  const response = await API.put(`/yields/${id}`, data);
  return response.data;
};

export const deleteYield = async (id) => {
  const response = await API.delete(`/yields/${id}`);
  return response.data;
};

export const getCropSummary = async () => {
  const response = await API.get("/yields/summary");
  return response.data;
};
