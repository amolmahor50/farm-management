"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  getUpcomingTasks,
} from "@/services/taskService";
import { toastError, toastSuccess } from "@/utils/toast";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getAllTasks(params);
      console.log(res?.data);
      setTasks(Array.isArray(res?.data) ? res?.data : []);
    } catch (err) {
      console.error(err.message || "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const data = await getUpcomingTasks();
      setUpcomingTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err.message || "Failed to fetch upcoming tasks");
      setUpcomingTasks([]);
    }
  };

  const addTask = async (taskData) => {
    try {
      const data = await createTask(taskData);
      toastSuccess("Task created successfully!");
    } catch (err) {
      console.error(err.message);
      toastError("Failed to create task");
    }
  };

  const updateTaskFn = async (taskId, taskData) => {
    try {
      const data = await updateTask(taskId, taskData);
      toastSuccess("Task updated successfully!");
    } catch (err) {
      console.error(err.message);
      toastError("Failed to update task");
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toastSuccess("Task deleted successfully!");
    } catch (err) {
      console.error(err.message);
      toastError("Failed to delete task");
    }
  };

  const completeTask = async (taskId) => {
    try {
      const data = await markTaskComplete(taskId);
      toastSuccess("Task marked as completed!");
    } catch (err) {
      console.error(err.message);
      toastError("Failed to complete task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        upcomingTasks,
        loading,
        fetchTasks,
        fetchUpcomingTasks,
        addTask,
        updateTask: updateTaskFn,
        removeTask,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};
