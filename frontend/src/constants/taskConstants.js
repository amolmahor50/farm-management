// Task Types (taskType in schema)
export const TASK_TYPES = [
  { value: "planting", label: "Planting" },
  { value: "irrigation", label: "Irrigation" },
  { value: "fertilization", label: "Fertilization" },
  { value: "pesticide", label: "Pesticide" },
  { value: "weeding", label: "Weeding" },
  { value: "harvesting", label: "Harvesting" },
  { value: "pruning", label: "Pruning" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

// Priority Levels
export const PRIORITY_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

// Statuses
export const TASK_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "overdue", label: "Overdue" },
];

export const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "seasonal"];
