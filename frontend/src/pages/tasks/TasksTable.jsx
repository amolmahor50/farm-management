"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/custom/Icon";
import { QuickTask } from "./QuickTask";
import { useTasks } from "@/contexts/TaskContext";

export const TasksTable = () => {
  const { tasks, removeTask, completeTask, loading } = useTasks();

  // Badge styles
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">N/A</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status || "N/A"}</Badge>;
    }
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Tasks</h2>

        <QuickTask
          trigger={
            <Button className="flex items-center gap-2">
              <Icon name="Plus" /> Add Task
            </Button>
          }
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading tasks...
                </TableCell>
              </TableRow>
            ) : tasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.taskType || "-"}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    {task.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    {task.isRecurring ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        {task.recurringPattern?.frequency || "Recurring"}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {task.assignedTo?.length > 0
                      ? task.assignedTo.map((p) => p.name).join(", ")
                      : "-"}
                  </TableCell>

                  {/* 🔽 Dropdown Menu Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-gray-100"
                        >
                          <Icon name="MoreVertical" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* View */}
                        <QuickTask
                          trigger={
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <Icon name="Eye" className="h-4 w-4" />
                              View Task
                            </DropdownMenuItem>
                          }
                          task={task}
                          view
                        />

                        {/* Edit */}
                        <QuickTask
                          trigger={
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <Icon name="Edit" className="h-4 w-4" />
                              Edit Task
                            </DropdownMenuItem>
                          }
                          task={task}
                        />

                        {/* Mark Complete */}
                        {task.status !== "completed" && (
                          <DropdownMenuItem
                            onClick={() => completeTask(task._id)}
                            className="cursor-pointer flex items-center gap-2 text-green-600"
                          >
                            <Icon name="Check" className="h-4 w-4" />
                            Mark Complete
                          </DropdownMenuItem>
                        )}

                        {/* Delete */}
                        <DropdownMenuItem
                          onClick={() => removeTask(task._id)}
                          className="cursor-pointer flex items-center gap-2 text-red-600"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
