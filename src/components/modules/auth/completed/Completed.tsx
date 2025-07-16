"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { TTask } from "@/types/task.type";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompletedTasks, updateTaskStatus } from "@/services/TaskService";
import { toast } from "sonner"; // ✅ Sonner Toast

const priorityColor: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const Completed = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await getCompletedTasks();
        if (res.success) {
          setTasks(res.data);
        } else {
          toast.error("Failed to fetch completed tasks");
        }
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  const handleCheckbox = async (task: TTask) => {
    const newStatus = "in-complete";
    const taskId = String(task._id);

    // Optimistic update
    const updated = tasks.filter((t) => String(t._id) !== taskId);
    setTasks(updated);

    try {
      const res = await updateTaskStatus(taskId, { status: newStatus });
      if (res.success) {
        toast.success("Task marked as in-complete");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task", error);
      toast.error("Error updating task");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {loading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          `Completed Tasks (${tasks.length})`
        )}
      </h1>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-full flex justify-between items-center border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-6 w-full justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </div>
              </div>
            ))
          : tasks.map((task) => (
              <div
                key={task._id}
                className="w-full flex justify-between items-center border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-6 w-full justify-between">
                  {/* Title */}
                  <span className="font-medium text-gray-800 w-1/4 truncate">
                    {task.title}
                  </span>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 w-1/4">
                    <CalendarIcon className="w-4 h-4 text-green-600" />
                    <span>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("en-GB")
                        : "No deadline"}
                    </span>
                  </div>

                  {/* Priority */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize w-1/6 text-center ${
                      priorityColor[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Pre-Checked Checkbox */}
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => handleCheckbox(task)}
                    className="w-4 h-4 mr-4 accent-green-600"
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Completed;
