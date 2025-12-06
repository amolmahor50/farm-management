import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchQRData = async (params = {}) => {
  const response = await API.get("/qr", { params });
  return response.data;
};

const getQRDataById = async (id) => {
  const response = await API.get(`/qr/${id}`);
  return response.data;
};

const createQRCode = async (data) => {
  const response = await API.post("/qr/generate", data);
  return response.data;
};

const scanQRCode = async (data) => {
  const response = await API.post("/qr/scan", data);
  return response.data;
};

const deleteQRCode = async (id) => {
  const response = await API.delete(`/qr/${id}`);
  return response.data;
};

export const useQRData = (params = {}) => {
  return useQuery({
    queryKey: ["qr-data", params],
    queryFn: () => fetchQRData(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useQRCode = (id) => {
  return useQuery({
    queryKey: ["qr-code", id],
    queryFn: () => getQRDataById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQRCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-data"] });
    },
  });
};

export const useScanQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scanQRCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-data"] });
    },
  });
};

export const useDeleteQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQRCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr-data"] });
    },
  });
};
