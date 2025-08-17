"use client";

import {
  BarChart,
  Bar,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import { BarChart3 } from "lucide-react";

// ---- Types ----
export type ReportTask = {
  id: number;
  name: string;
  category: string;
  priority: "High" | "Medium" | "Low" | string;
  status: "Completed" | "Expired" | "Pending";
  startTime: string; // ISO
  endTime: string; // ISO
  duration: number | null; // ms (end - start) if completed, else null
  completionTime: number | null; // seconds from DB (optional)
  completedOn: string | null;
};

type ReportsProps = {
  reportData?: ReportTask[];
};

// ---- Helpers ----
const processChartData = (data?: ReportTask[]) => {
  if (!Array.isArray(data)) return [];
  const dailyData: Record<
    string,
    {
      date: string;
      completed: number;
      pending: number;
      expired: number;
      total: number;
    }
  > = {};

  data.forEach((task) => {
    const date = new Date(task.startTime).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        completed: 0,
        pending: 0,
        expired: 0,
        total: 0,
      };
    }
    dailyData[date].total++;
    if (task.status === "Completed") dailyData[date].completed++;
    else if (task.status === "Pending") dailyData[date].pending++;
    else dailyData[date].expired++;
  });

  return Object.values(dailyData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const processPriorityData = (data?: ReportTask[]) => {
  if (!Array.isArray(data)) return [];
  const priorityCount: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
  data.forEach((task) => {
    priorityCount[task.priority] = (priorityCount[task.priority] ?? 0) + 1;
  });
  return Object.entries(priorityCount).map(([name, value]) => ({
    name,
    value,
  }));
};

// Softer blue/indigo theme chips
const PRIORITY_STYLES: Record<string, { pill: string; dot: string }> = {
  High: { pill: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-600" },
  Medium: {
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-600",
  },
  Low: { pill: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-600" },
};
const DEFAULT_PRIORITY = {
  pill: "bg-slate-50 text-slate-700 ring-slate-200",
  dot: "bg-slate-500",
};

const STATUS_STYLES: Record<
  ReportTask["status"],
  { pill: string; dot: string }
> = {
  Completed: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-600",
  },
  Expired: {
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-600",
  },
  Pending: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-600",
  },
};

const Reports: React.FC<ReportsProps> = ({ reportData }) => {
  const safeReportData = Array.isArray(reportData) ? reportData : [];

  const totalTasks = safeReportData.length;
  const completedTasks = safeReportData.filter(
    (t) => t.status === "Completed"
  ).length;
  const overdueTasks = safeReportData.filter(
    (t) => t.status === "Expired"
  ).length;

  const chartData = processChartData(safeReportData);
  const priorityData = processPriorityData(safeReportData);

  // Sort by most recent startTime for the table
  const recent = [...safeReportData].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center mb-10">
        <span
          className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl
                         bg-gradient-to-br from-blue-100 to-indigo-100 ring-1 ring-inset ring-blue-200"
        >
          <BarChart3 className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-md font-medium text-gray-600 mb-1">
            Total Tasks
          </h3>
          <p className="text-4xl font-bold text-indigo-600">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-md font-medium text-gray-600 mb-1">
            Completed Tasks
          </h3>
          <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-md font-medium text-gray-600 mb-1">
            Overdue Tasks
          </h3>
          <p className="text-4xl font-bold text-red-500">{overdueTasks}</p>
        </div>
      </div>

      {/* Task Completion Trend Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Task Completion Trend
        </h2>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="pending"
                name="Pending"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
              <Area
                type="monotone"
                dataKey="expired"
                name="Expired"
                stackId="1"
                stroke="#ff6b6b"
                fill="#ff6b6b"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Priority Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Task Priority Distribution
        </h2>
        <div className="w-full max-w-xl h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Tasks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Tasks
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody className="bg-white text-sm text-gray-700">
            {recent.slice(0, 5).map((task) => {
              const pStyle = PRIORITY_STYLES[task.priority] ?? DEFAULT_PRIORITY;
              const sStyle = STATUS_STYLES[task.status];

              return (
                <tr
                  key={task.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{task.name}</td>
                  <td className="px-4 py-2">{task.category}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${pStyle.pill}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${pStyle.dot}`}
                      />
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${sStyle.pill}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${sStyle.dot}`}
                      />
                      {task.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {task.duration
                      ? `${Math.round(task.duration / (1000 * 60 * 60))}h`
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
