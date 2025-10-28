import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/contexts/TaskContext";
import {
  TASK_TYPES,
  PRIORITY_LEVELS,
  TASK_STATUSES,
} from "@/constants/taskConstants";

export const QuickTask = ({ trigger, task }) => {
  const { addTask, updateTask } = useTasks();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: today,
    time: "",
    crop: "",
    category: "",
    priority: "medium",
    taskType: "",
    status: "pending",
  });

  // Fill form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        startDate: task.startDate || today,
        time: task.time || "",
        crop: task.crop || "",
        category: task.category || "",
        priority: task.priority || "medium",
        taskType: task.taskType || "",
        status: task.status || "pending",
      });
    }
  }, [task]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task) {
      await updateTask(task.id, formData);
    } else {
      await addTask(formData);
    }
    setFormData({
      title: "",
      description: "",
      startDate: today,
      time: "",
      crop: "",
      category: "",
      priority: "medium",
      taskType: "",
      status: "pending",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] md:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 mt-2"
          onSubmit={(e) =>
            handleSubmit(
              e,
              document.querySelector('[data-state="open"]')?.click()
            )
          }
        >
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              required
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>

          {/* Crop */}
          <div className="space-y-2">
            <Label>Crop</Label>
            <Input
              type="text"
              value={formData.crop}
              onChange={(e) => handleChange("crop", e.target.value)}
            />
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={formData.taskType}
              onValueChange={(val) => handleChange("taskType", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(val) => handleChange("priority", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleChange("status", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                document.querySelector('[data-state="open"]')?.click()
              }
            >
              Cancel
            </Button>
            <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
