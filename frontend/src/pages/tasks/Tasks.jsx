import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/custom/Icon";
import {
  TypographyH2,
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";
import { mockTasks } from "../../data/mockData";
import { QuickTask } from "./QuickTask";

export const Tasks = () => {
  const [tasks] = useState(mockTasks);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const overdueTasks = tasks.filter((t) => t.status === "Overdue");

  const upcomingTasks = tasks
    .filter((t) => t.status === "Pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const tasksByCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <Icon name="CheckCircle" color="green" />;
      case "Overdue":
        return <Icon name="AlertCircle" color="red" />;
      default:
        return <Icon name="Clock" color="blue" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TypographyH2> Task & Activity Planner</TypographyH2>
        <Button>
          <QuickTask
            trigger={
              <span className="flex items-center gap-1">
                <Icon name="Plus" /> Add Task
              </span>
            }
          />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Pending Tasks"
          icon="Clock"
          value={pendingTasks.length}
          color="blue"
        />
        <SummaryCard
          title="Completed Tasks"
          icon="CheckCircle"
          value={completedTasks.length}
          color="green"
        />
        <SummaryCard
          title="Overdue Tasks"
          icon="AlertCircle"
          value={overdueTasks.length}
          color="red"
        />
      </div>

      {/* Task List */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TypographyH4>All Tasks</TypographyH4>
          <div className="flex gap-2">
            {["all", "Pending", "Completed"].map((status) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status)}
                variant={filterStatus !== status ? "outline" : "default"}
                size="sm"
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <TypographySmall>{task.title}</TypographySmall>
                      <TypographyMuted>{task.description}</TypographyMuted>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 ml-8">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {task.category}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {task.crop}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-10">
                  <div className="space-y-3">
                    <TypographySmall className="flex items-center gap-1">
                      <Icon name="Calendar" size={16} />
                      <span>{task.date}</span>
                    </TypographySmall>
                    <TypographySmall className="flex items-center gap-1">
                      <Icon name="Clock" size={16} />
                      <span className="text-sm font-medium">{task.time}</span>
                    </TypographySmall>
                  </div>
                  {task.status === "Pending" && (
                    <Button size="xs">Mark Complete</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <TypographyH4>Upcoming Tasks</TypographyH4>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <TypographySmall>{task.title}</TypographySmall>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <TypographyMuted>
                    {task.crop} - {task.category}
                  </TypographyMuted>
                  <TypographySmall>
                    {task.date} at {task.time}
                  </TypographySmall>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tasks by Category */}
        <Card>
          <TypographyH4>Tasks by Category</TypographyH4>
          <div className="space-y-3">
            {Object.entries(tasksByCategory).map(([category, count]) => (
              <div
                key={category}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <TypographySmall>{category}</TypographySmall>
                <span className="h-6 w-6 flex justify-center items-center bg-green-600 text-white rounded-full text-sm font-semibold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Task Suggestions */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <TypographyH4>Task Suggestions</TypographyH4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gap-2">
            <TypographySmall>Seasonal Tasks</TypographySmall>
            <TypographyMuted>
              Based on current season, consider planting winter crops like wheat
              and mustard.
            </TypographyMuted>
          </Card>
          <Card className="gap-2">
            <TypographySmall>Maintenance</TypographySmall>
            <TypographyMuted>
              Schedule regular irrigation system checks to ensure optimal water
              supply.
            </TypographyMuted>
          </Card>
        </div>
      </Card>
    </div>
  );
};
