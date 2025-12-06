import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchTasks = async (params = {}) => {
  const response = await API.get("/tasks", { params });
  return response.data;
};

const getTaskById = async (id) => {
  const response = await API.get(`/tasks/${id}`);
  return response.data;
};

const createTask = async (data) => {
  const response = await API.post("/tasks", data);
  return response.data;
};

const updateTask = async ({ id, ...data }) => {
  const response = await API.put(`/tasks/${id}`, data);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

const completeTask = async (id) => {
  const response = await API.patch(`/tasks/${id}/complete`);
  return response.data;
};

export const useTasks = (params = {}) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => fetchTasks(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
