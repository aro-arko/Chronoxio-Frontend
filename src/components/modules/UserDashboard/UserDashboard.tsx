/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPieChart,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";
import { MdOutlineLeaderboard } from "react-icons/md";
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

// -------- Types --------
type TActivity = {
  id: string | number;
  action: "Completed" | "Created" | "Expired" | string;
  taskName: string;
  priority: "High" | "Medium" | "Low" | string;
  timestamp?: number; // optional: present if coming from Tasks.tsx Activity
};

type TReportData = { activities?: TActivity[] };

type TWeeklyPoint = {
  name: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  value: number;
};

type TTask = {
  _id: string;
  title: string;
  userId: string;
  startDate: string; // ISO
  endDate: string; // ISO
  category: string;
  priority: "High" | "Medium" | "Low" | string;
  status: "completed" | "pending" | "expired" | string;
  timeSpent: number; // seconds from DB
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

type Props = {
  reportData?: TReportData;
  weeklyReport?: TWeeklyPoint[];
  tasks?: TTask[];
  setShowTaskModal?: (open: boolean) => void;
};

// -------- Helpers --------
const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const minutes = payload[0]?.payload?.minutes ?? 0;
    return (
      <div className="rounded-md bg-white/90 p-2 shadow border border-gray-200">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-600">{formatMinutes(minutes)}</p>
      </div>
    );
  }
  return null;
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let duration = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (let i = 0, acc = 1; i < ranges.length; i++) {
    const [limit, nextUnit] = ranges[i];
    if (Math.abs(duration) < limit) {
      unit = nextUnit;
      break;
    }
    duration = duration / limit;
  }
  duration = Math.round(duration) as number;
  return rtf.format(-duration, unit);
}

const UserDashboard: React.FC<Props> = ({
  reportData,
  weeklyReport,
  tasks,
  setShowTaskModal,
}) => {
  // ---- KPIs from tasks (timeSpent is in *seconds*) ----
  const {
    completedCount,
    pendingCount,
    expiredCount,
    totalTimeSpentMinutes,
    productivityPercent,
    upcomingPendingCount,
  } = useMemo(() => {
    const list = tasks ?? [];
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const completed = list.filter((t) => t.status === "completed");
    const pending = list.filter((t) => t.status === "pending");
    const expired = list.filter((t) => t.status === "expired");

    const completedCount = completed.length;
    const pendingCount = pending.length;
    const expiredCount = expired.length;

    // sum seconds → convert to minutes
    const totalTimeSpentSeconds = completed.reduce(
      (sum, t) => sum + (Number(t.timeSpent) || 0),
      0
    );
    const totalTimeSpentMinutes = Math.floor(totalTimeSpentSeconds / 60);

    const productivityPercent =
      list.length > 0 ? Math.round((completedCount / list.length) * 100) : 0;

    // upcoming = PENDING tasks that start within next 3 days
    const upcomingPendingCount = pending.filter((t) => {
      const start = new Date(t.startDate);
      return start >= now && start <= in3Days;
    }).length;

    return {
      completedCount,
      pendingCount,
      expiredCount,
      totalTimeSpentMinutes,
      productivityPercent,
      upcomingPendingCount,
    };
  }, [tasks]);

  // ---- Weekly chart (Mon→Sun) using weeklyReport minutes ----
  const productivityData = useMemo(() => {
    const order: TWeeklyPoint["name"][] = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
    const map = new Map<string, number>(
      (weeklyReport ?? []).map((d) => [d.name, d.value])
    );
    return order.map((day) => ({ name: day, minutes: map.get(day) ?? 0 }));
  }, [weeklyReport]);

  // ---- Distribution by status ----
  const taskDistributionData = useMemo(
    () => [
      { name: "Completed", value: completedCount },
      { name: "Pending", value: pendingCount },
      { name: "Expired", value: expiredCount },
    ],
    [completedCount, pendingCount, expiredCount]
  );

  // ---- Recent activities (latest 4) ----
  const recentActivities = useMemo(() => {
    // If reportData already provides an activity feed, use it (latest 4)
    if (reportData?.activities && reportData.activities.length > 0) {
      return reportData.activities
        .slice()
        .reverse()
        .slice(0, 4)
        .map((a) => ({
          ...a,
          when: a.timestamp ? timeAgo(new Date(a.timestamp)) : "",
        }));
    }

    // Otherwise, synthesize from tasks
    const list = tasks ?? [];
    type Feed = TActivity & { when: string; ts: number };
    const feed: Feed[] = [];

    for (const t of list) {
      const createdTs = new Date(t.createdAt).getTime();
      feed.push({
        id: `${t._id}-created`,
        action: "Created",
        taskName: t.title,
        priority: t.priority,
        timestamp: createdTs,
        ts: createdTs,
        when: timeAgo(new Date(createdTs)),
      });

      if (t.status === "completed") {
        const doneTs = new Date(t.updatedAt || t.endDate).getTime();
        feed.push({
          id: `${t._id}-completed`,
          action: "Completed",
          taskName: t.title,
          priority: t.priority,
          timestamp: doneTs,
          ts: doneTs,
          when: timeAgo(new Date(doneTs)),
        });
      }

      if (t.status === "expired") {
        const expTs = new Date(t.updatedAt || t.endDate).getTime();
        feed.push({
          id: `${t._id}-expired`,
          action: "Expired",
          taskName: t.title,
          priority: t.priority,
          timestamp: expTs,
          ts: expTs,
          when: timeAgo(new Date(expTs)),
        });
      }
    }

    return feed.sort((a, b) => b.ts - a.ts).slice(0, 4);
  }, [reportData?.activities, tasks]);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6 rounded-xl">
      <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-blue-100">Your productivity at a glance</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 flex items-center border border-white/20">
              <div className="p-3 rounded-full bg-blue-100/80 text-blue-600 mr-4">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {completedCount}
                </p>
                <p className="text-green-500 text-sm flex items-center">
                  <FiTrendingUp className="mr-1" />
                </p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 flex items-center border border-white/20">
              <div className="p-3 rounded-full bg-purple-100/80 text-purple-600 mr-4">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Time Spent</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatMinutes(totalTimeSpentMinutes)}
                </p>
                <p className="text-green-500 text-sm flex items-center">
                  <FiTrendingUp className="mr-1" />
                </p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 flex items-center border border-white/20">
              <div className="p-3 rounded-full bg-green-100/80 text-green-600 mr-4">
                <FiActivity size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Productivity</p>
                <p className="text-2xl font-bold text-gray-800">
                  {productivityPercent}%
                </p>
                <p className="text-red-500 text-sm flex items-center">
                  <FiTrendingUp className="mr-1 rotate-180" />
                </p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 flex items-center border border-white/20">
              <div className="p-3 rounded-full bg-yellow-100/80 text-yellow-600 mr-4">
                <FiCalendar size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Upcoming Tasks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {upcomingPendingCount}
                </p>
                <p className="text-gray-500 text-sm">Next 3 days (pending)</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Weekly Productivity
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">
                    Week
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                    Month
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => formatMinutes(Number(v))} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="minutes"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="minutes"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Task Distribution
              </h2>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {taskDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 lg:col-span-2 border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-3 ${
                            activity.action === "Completed"
                              ? "bg-green-100 text-green-600"
                              : activity.action === "Expired"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {activity.action === "Completed" ? (
                            <FiCheckCircle size={16} />
                          ) : (
                            <FiPlus size={16} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {activity.action} {activity.taskName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {("when" in activity && (activity as any).when) ||
                              ""}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          activity.priority
                        )}`}
                      >
                        {activity.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent activities
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowTaskModal?.(true)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-100"
                >
                  <Link href="/user/tasks">
                    <span>My Tasks</span>
                  </Link>
                  <FiPlus size={18} />
                </button>

                <Link
                  href="/app/leaderboard"
                  className="w-full flex items-center justify-between p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition border border-green-100"
                >
                  <span>Leaderboard</span>
                  <MdOutlineLeaderboard size={18} />
                </Link>

                <Link
                  href="/app/reports"
                  className="w-full flex items-center justify-between p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition border border-yellow-100"
                >
                  <span>Reports</span>
                  <FiPieChart size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
