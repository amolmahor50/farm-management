import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  getUpcomingTasks,
} from "@/services/taskService";
import { toastError, toastSuccess } from "../utils/toast";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tasks
  const fetchTasks = async (params = {}) => {
    try {
      setLoading(true);
      const data = await getAllTasks(params);
      setTasks(data.data);
    } catch (err) {
      toastError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming tasks
  const fetchUpcomingTasks = async () => {
    try {
      const data = await getUpcomingTasks();
      setUpcomingTasks(data.data);
    } catch (err) {
      toastError(err.message || "Failed to fetch upcoming tasks");
    }
  };

  // Add a new task
  const addTask = async (taskData) => {
    try {
      const data = await createTask(taskData);
      toastSuccess("Task created successfully!");
      setTasks((prev) => [data.data, ...prev]);
    } catch (err) {
      toastError(err.message || "Failed to create task");
    }
  };

  // Update a task
  const editTask = async (taskId, taskData) => {
    try {
      const data = await updateTask(taskId, taskData);
      toastSuccess("Task updated successfully!");
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.data : t)));
    } catch (err) {
      toastError(err.message || "Failed to update task");
    }
  };

  // Delete a task
  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toastSuccess("Task deleted successfully!");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      toastError(err.message || "Failed to delete task");
    }
  };

  // Mark task as completed
  const completeTask = async (taskId) => {
    try {
      const data = await markTaskComplete(taskId);
      toastSuccess("Task marked as completed!");
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.data : t)));
    } catch (err) {
      toastError(err.message || "Failed to complete task");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUpcomingTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        upcomingTasks,
        loading,
        fetchTasks,
        fetchUpcomingTasks,
        addTask,
        editTask,
        removeTask,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for easy usage
export const useTasks = () => useContext(TaskContext);
