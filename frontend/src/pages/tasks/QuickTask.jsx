"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/custom/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks } from "@/contexts/TaskContext";
import {
  PRIORITY_LEVELS,
  TASK_TYPES,
  TASK_STATUSES,
  RECURRING_FREQUENCIES,
} from "../../constants/taskConstants";

export const QuickTask = ({ trigger, task, view = false }) => {
  const { addTask, updateTask, loading } = useTasks();
  const today = new Date().toISOString().split("T")[0];

  const defaultFormData = {
    title: "",
    description: "",
    taskType: "",
    priority: "medium",
    status: "pending",
    startDate: today,
    endDate: "",
    dueDate: "",
    location: { field: "", area: "" },
    assignedTo: [{ name: "", phone: "", role: "" }],
    estimatedCost: "",
    actualCost: "",
    estimatedDuration: { value: "", unit: "hours" },
    isRecurring: false,
    recurringPattern: { frequency: "daily", interval: 1, endAfter: "" },
    weatherDependent: false,
    notes: "",
    tags: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        ...defaultFormData,
        ...task,
        recurringPattern: {
          ...defaultFormData.recurringPattern,
          ...task.recurringPattern,
        },
        assignedTo:
          task.assignedTo?.length > 0
            ? task.assignedTo
            : [{ name: "", phone: "", role: "" }],
      });
    }
  }, [task]);

  const handleChange = (field, value) => {
    if (view) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field, key, value) => {
    if (view) return;
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }));
  };

  const handleAssignedChange = (index, key, value) => {
    if (view) return;
    const updated = [...formData.assignedTo];
    updated[index][key] = value;
    setFormData((prev) => ({ ...prev, assignedTo: updated }));
  };

  const handleAddAssigned = () => {
    if (view) return;
    setFormData((prev) => ({
      ...prev,
      assignedTo: [...prev.assignedTo, { name: "", phone: "", role: "" }],
    }));
  };

  const handleRemoveAssigned = (index) => {
    if (view) return;
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.taskType) newErrors.taskType = "Task type is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (closeSheet) => {
    if (view) return;
    if (!validate()) return;

    const cleanData = {
      ...formData,
      estimatedCost: Number(formData.estimatedCost) || 0,
      actualCost: Number(formData.actualCost) || 0,
      estimatedDuration: {
        value: Number(formData.estimatedDuration.value) || 0,
        unit: formData.estimatedDuration.unit,
      },
      recurringPattern: formData.isRecurring
        ? {
            frequency: formData.recurringPattern.frequency || "daily",
            interval: Number(formData.recurringPattern.interval) || 1,
            endAfter: formData.recurringPattern.endAfter || null,
          }
        : undefined,
    };

    if (task) await updateTask(task._id, cleanData);
    else await addTask(cleanData);

    setFormData(defaultFormData);
    closeSheet?.();
  };

  const renderLabel = (text, required = false) => (
    <Label className="flex items-center gap-1">
      {text}
      {required && <span className="text-red-500">*</span>}
    </Label>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {view ? "View Task" : task ? "Edit Task" : "Add Task"}
          </SheetTitle>
        </SheetHeader>

        <form className="space-y-4 px-4" onSubmit={(e) => e.preventDefault()}>
          {/* 📝 Title */}
          <div className="space-y-1">
            {renderLabel("Title", true)}
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={view}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* 📄 Description */}
          <div className="space-y-1">
            {renderLabel("Description")}
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={view}
            />
          </div>

          {/* 📅 Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              {renderLabel("Start Date", true)}
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                disabled={view}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-1">
              {renderLabel("End Date")}
              <Input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
                disabled={view}
              />
            </div>
          </div>

          {/* 📋 Task Type / Priority / Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              {renderLabel("Task Type", true)}
              <Select
                value={formData.taskType}
                onValueChange={(val) => handleChange("taskType", val)}
                disabled={view}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taskType && (
                <p className="text-red-500 text-sm">{errors.taskType}</p>
              )}
            </div>

            <div className="space-y-1">
              {renderLabel("Priority")}
              <Select
                value={formData.priority}
                onValueChange={(val) => handleChange("priority", val)}
                disabled={view}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
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

            <div className="space-y-1">
              {renderLabel("Status")}
              <Select
                value={formData.status}
                onValueChange={(val) => handleChange("status", val)}
                disabled={view}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
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
          </div>

          {/* 📍 Location */}
          <div className="space-y-1 border-t pt-3">
            {renderLabel("Location")}
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Field"
                value={formData.location.field || ""}
                onChange={(e) =>
                  handleNestedChange("location", "field", e.target.value)
                }
                disabled={view}
              />
              <Input
                placeholder="Area"
                value={formData.location.area || ""}
                onChange={(e) =>
                  handleNestedChange("location", "area", e.target.value)
                }
                disabled={view}
              />
            </div>
          </div>

          {/* 👥 Assigned Users */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between items-center">
              {renderLabel("Assigned Users")}
              {!view && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddAssigned}
                >
                  <Icon name="Plus" />
                </Button>
              )}
            </div>

            {formData.assignedTo.map((person, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={person.name}
                    onChange={(e) =>
                      handleAssignedChange(i, "name", e.target.value)
                    }
                    disabled={view}
                  />
                  <Input
                    placeholder="Role"
                    value={person.role}
                    onChange={(e) =>
                      handleAssignedChange(i, "role", e.target.value)
                    }
                    disabled={view}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Phone"
                    value={person.phone}
                    onChange={(e) =>
                      handleAssignedChange(i, "phone", e.target.value)
                    }
                    disabled={view}
                  />
                  {!view && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleRemoveAssigned(i)}
                    >
                      <Icon name="Trash2" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 🕒 Estimated Duration */}
          <div className="space-y-1 border-t pt-3">
            {renderLabel("Estimated Duration")}
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={formData.estimatedDuration.value || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "estimatedDuration",
                    "value",
                    e.target.value
                  )
                }
                disabled={view}
              />
              <Select
                value={formData.estimatedDuration.unit || "hours"}
                onValueChange={(val) =>
                  handleNestedChange("estimatedDuration", "unit", val)
                }
                disabled={view}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 🔁 Recurring */}
          <div className="space-y-1 border-t pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.isRecurring}
                onCheckedChange={(checked) =>
                  handleChange("isRecurring", !!checked)
                }
                disabled={view}
              />
              {renderLabel("Recurring Task")}
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Select
                  value={formData.recurringPattern.frequency || "daily"}
                  onValueChange={(val) =>
                    handleNestedChange("recurringPattern", "frequency", val)
                  }
                  disabled={view}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRING_FREQUENCIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Interval"
                  value={formData.recurringPattern.interval || 1}
                  onChange={(e) =>
                    handleNestedChange(
                      "recurringPattern",
                      "interval",
                      e.target.value
                    )
                  }
                  disabled={view}
                />

                <Input
                  type="date"
                  placeholder="End After"
                  value={formData.recurringPattern.endAfter || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "recurringPattern",
                      "endAfter",
                      e.target.value
                    )
                  }
                  disabled={view}
                />
              </div>
            )}
          </div>

          {/* ☁️ Weather Dependent */}
          <div className="flex items-center space-x-2 border-t pt-3">
            <Checkbox
              checked={formData.weatherDependent}
              onCheckedChange={(checked) =>
                handleChange("weatherDependent", !!checked)
              }
              disabled={view}
            />
            {renderLabel("Weather Dependent")}
          </div>

          {/* 🏷️ Tags */}
          <div className="space-y-1">
            {renderLabel("Tags")}
            <Input
              placeholder="Comma separated"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                handleChange(
                  "tags",
                  e.target.value.split(",").map((t) => t.trim())
                )
              }
              disabled={view}
            />
          </div>

          {/* 🗒️ Notes */}
          <div className="space-y-1">
            {renderLabel("Notes")}
            <Textarea
              rows={2}
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              disabled={view}
            />
          </div>

          {!view && (
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Spinner />}
                  {task ? "Update Task" : "Add Task"}
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};
