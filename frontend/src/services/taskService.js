import { API } from "@/app/CustomAxios";

// Get all tasks with optional filters
export const getAllTasks = async (params = {}) => {
  try {
    const response = await API.get("/tasks", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single task by ID
export const getTask = async (taskId) => {
  try {
    const response = await API.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await API.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await API.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await API.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark task as completed
export const markTaskComplete = async (taskId) => {
  try {
    const response = await API.patch(`/tasks/${taskId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get upcoming tasks (next 7 days)
export const getUpcomingTasks = async () => {
  try {
    const response = await API.get("/tasks/upcoming");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
