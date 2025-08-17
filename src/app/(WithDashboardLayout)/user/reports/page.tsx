import Reports, { ReportTask } from "@/components/modules/Reports/Reports";
import { getTasksForDashboard } from "@/services/TaskService";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "View your task reports",
};

// API task shape coming from your example
type ApiTask = {
  _id: string;
  title: string;
  userId: string;
  startDate: string;
  endDate: string;
  category: string;
  priority: "High" | "Medium" | "Low" | string;
  status: "completed" | "pending" | "expired" | string;
  timeSpent: number; // seconds
  createdAt: string;
  updatedAt: string;
};

const statusMap: Record<string, ReportTask["status"]> = {
  completed: "Completed",
  pending: "Pending",
  expired: "Expired",
};

function toReportTasks(apiTasks: ApiTask[]): ReportTask[] {
  return apiTasks.map((t, idx) => {
    const statusTitled = statusMap[(t.status || "").toLowerCase()] ?? "Pending";
    const durationMs =
      statusTitled === "Completed"
        ? new Date(t.endDate).getTime() - new Date(t.startDate).getTime()
        : null;

    return {
      id: idx + 1, // local numeric id for the table
      name: t.title,
      category: t.category,
      priority: t.priority,
      status: statusTitled,
      startTime: t.startDate,
      endTime: t.endDate,
      duration: durationMs,
      completionTime: typeof t.timeSpent === "number" ? t.timeSpent : null, // seconds from DB
      completedOn:
        statusTitled === "Completed" ? t.updatedAt ?? t.endDate : null,
    };
  });
}

export default async function ReportsPage() {
  // Fetch tasks from your API (server-side; uses cookies())
  const tasks = (await getTasksForDashboard()) as ApiTask[];

  // Map API tasks -> report-friendly shape
  const reportTasks = toReportTasks(Array.isArray(tasks) ? tasks : []);

  return (
    <div>
      <Reports reportData={reportTasks} />
    </div>
  );
}
