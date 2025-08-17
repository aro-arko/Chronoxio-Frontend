/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tasks.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import {
  Loader2,
  Pause,
  Play,
  Check,
  Clock,
  CalendarDays,
  X,
} from "lucide-react";
import { FiMusic } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 🔽 API
import {
  createTask,
  completeTask,
  getTasks,
  deleteTask as deleteTaskApi,
  updateExpiredTask,
} from "@/services/TaskService";

type Task = {
  id: number;
  serverId?: string;
  taskName: string;
  category: string;

  // Original strings from backend (kept for reference; not used for logic/render)
  startTime: string;
  endTime: string;

  // Parsed milliseconds for logic
  startMs: number;
  endMs: number;

  priority: "High" | "Medium" | "Low" | string;
  completionTime?: number; // seconds
};

type Activity = {
  id: number;
  taskName: string;
  priority: string;
  action: "Created" | "Completed" | string;
  timestamp: number;
};

type ReportData = {
  tasks: Array<{
    id: number;
    name: string;
    category: string;
    priority: string;
    startTime: string;
    endTime: string;
    status: "Completed" | "Expired" | "Pending";
    duration: number | null;
    completionTime: number | null;
    completedOn: string | null;
  }>;
  activities: Activity[];
};

type Props = {
  setReportData?: (data: ReportData) => void;
  showTaskModal: boolean;
  setShowTaskModal: (open: boolean) => void;
};

/** Format ms → "YYYY-MM-DDTHH:mm" (no seconds, no TZ) */
function formatLocalNoSeconds(ms: number): string {
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

/** Parse various inputs to local wall-clock ms:
 * - ISO w/ Z or timezone (e.g., "2025-08-17T19:31:00.000Z" or "+08:00"):
 *    We IGNORE the TZ and treat the clock-time as local.
 * - ISO w/o TZ ("2025-08-17T19:41"):
 *    Already local → keep as local.
 * - "DD/MM/YYYY, HH:mm(:ss)?" → build local Date.
 */
function parseDateToMs(input: string): number {
  if (!input) return NaN;
  const s = input.trim();

  // "DD/MM/YYYY, HH:mm[:ss]"
  const mDMY = s.match(
    /^(\d{2})\/(\d{2})\/(\d{4})[,\s]+(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (mDMY) {
    const [, dd, mm, yyyy, HH, MM, SS] = mDMY;
    return new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(HH),
      Number(MM),
      SS ? Number(SS) : 0,
      0
    ).getTime();
  }

  // ISO with explicit timezone (Z or ±hh:mm). Treat as *local wall-clock*.
  // Examples matched here:
  //  - 2025-08-17T19:31:00.000Z
  //  - 2025-08-17T19:31:00Z
  //  - 2025-08-17T19:31:00+00:00, 2025-08-17T19:31:00-04:00
  const mISOtz = s.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(Z|[+\-]\d{2}:\d{2})$/
  );
  if (mISOtz) {
    const [, Y, M, D, h, m, sec, ms] = mISOtz;
    return new Date(
      Number(Y),
      Number(M) - 1,
      Number(D),
      Number(h),
      Number(m),
      sec ? Number(sec) : 0,
      ms ? Number(ms) : 0
    ).getTime();
  }

  // ISO without timezone → spec treats as local already
  const mISOlocal = s.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?$/
  );
  if (mISOlocal) {
    const [, Y, M, D, h, m, sec, ms] = mISOlocal;
    return new Date(
      Number(Y),
      Number(M) - 1,
      Number(D),
      Number(h),
      Number(m),
      sec ? Number(sec) : 0,
      ms ? Number(ms) : 0
    ).getTime();
  }

  // Fallback
  return new Date(s).getTime();
}

function ensureSeconds(local: string): string {
  if (!local) return local;
  // Only used for sending datetime-local values to backend
  // "YYYY-MM-DDTHH:mm" -> add ":00"
  const time = local.split("T")[1] || "";
  const colons = (time.match(/:/g) || []).length;
  if (colons === 1) return `${local}:00`;
  return local;
}

const IconDeleteButton = ({
  onClick,
  label = "Delete task",
}: {
  onClick: () => void;
  label?: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    title={label}
    onClick={onClick}
    className="h-9 w-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
  >
    <MdDeleteForever className="h-5 w-5" />
    <span className="sr-only">{label}</span>
  </Button>
);

const Tasks: React.FC<Props> = ({
  setReportData,
  showTaskModal,
  setShowTaskModal,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});
  const [pausedTimers, setPausedTimers] = useState<Record<number, boolean>>({});
  const [remainingTimes, setRemainingTimes] = useState<Record<number, number>>(
    {}
  );
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {}
  );
  const [expiredTasks, setExpiredTasks] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [taskStartTimes, setTaskStartTimes] = useState<Record<number, number>>(
    {}
  );
  const [activities, setActivities] = useState<Activity[]>([]);

  const notificationRef = useRef<Record<number, any>>({});
  const longTaskTimers = useRef<Record<number, any>>({});
  const intervalsRef = useRef<Record<number, any>>({});
  const expiredCalledRef = useRef<Record<number, boolean>>({});

  // ---- Backend payload helpers
  const buildCreatePayload = (t: Task) => ({
    title: t.taskName,
    startDate: ensureSeconds(formatLocalNoSeconds(t.startMs)), // send normalized local without seconds TZ (add :00 above)
    category: t.category,
    priority: t.priority,
    endDate: ensureSeconds(formatLocalNoSeconds(t.endMs)),
  });

  const buildCompletePayload = (timeSpentSeconds: number) => ({
    timeSpent: timeSpentSeconds,
  });

  // ---------- Initial fetch
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTasks();
        const data: any[] = Array.isArray(res?.data) ? res.data : [];

        const now = Date.now();
        const mapped: Task[] = [];
        const completedMap: Record<number, boolean> = {};
        const expiredMap: Record<number, boolean> = {};

        data.forEach((item, idx) => {
          const localId = Date.now() + idx;

          // Parse backend strings as *local* regardless of Z/offset
          const startMs = parseDateToMs(item.startDate);
          const endMs = parseDateToMs(item.endDate);

          const t: Task = {
            id: localId,
            serverId: item._id,
            taskName: item.title,
            category: item.category,
            startTime: item.startDate,
            endTime: item.endDate,
            startMs,
            endMs,
            priority: item.priority,
            completionTime:
              item.status === "completed"
                ? Number(item.timeSpent || 0)
                : undefined,
          };

          mapped.push(t);

          if (item.status === "completed") {
            completedMap[localId] = true;
          } else if (endMs < now) {
            expiredMap[localId] = true;
            expiredCalledRef.current[localId] = true; // prevent re-calling API on mount
          }
        });

        setTasks(mapped);
        setCompletedTasks(completedMap);
        setExpiredTasks(expiredMap);
        setCompletedCount(Object.keys(completedMap).length);
      } catch (e: any) {
        console.error("Failed to load tasks:", e);
        toast.error(e?.message || "Failed to load tasks");
      }
    };

    load();
  }, []);

  const generateReportData = (): ReportData => {
    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        name: task.taskName,
        category: task.category,
        priority: task.priority,
        // Keep original strings in report if you prefer; or switch to display format:
        startTime: formatLocalNoSeconds(task.startMs),
        endTime: formatLocalNoSeconds(task.endMs),
        status: completedTasks[task.id]
          ? "Completed"
          : expiredTasks[task.id]
          ? "Expired"
          : "Pending",
        duration: completedTasks[task.id] ? task.endMs - task.startMs : null,
        completionTime: task.completionTime ?? null,
        completedOn: completedTasks[task.id] ? new Date().toISOString() : null,
      })),
      activities,
    };
  };

  useEffect(() => {
    if (setReportData) setReportData(generateReportData());
  }, [tasks, completedTasks, expiredTasks, activities, setReportData]);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      Object.values(notificationRef.current).forEach(clearTimeout);
      Object.values(longTaskTimers.current).forEach(clearTimeout);
    };
  }, []);

  // 5-minute heads-up
  useEffect(() => {
    const checkForUpcomingTasks = () => {
      tasks.forEach((task) => {
        const taskId = task.id;
        const now = Date.now();
        const timeUntilStart = task.startMs - now;

        if (notificationRef.current[taskId]) {
          clearTimeout(notificationRef.current[taskId]);
          delete notificationRef.current[taskId];
        }

        if (timeUntilStart > 0 && timeUntilStart <= 5 * 60 * 1000) {
          notificationRef.current[taskId] = setTimeout(() => {
            toast.info(`"${task.taskName}" starts in 5 minutes. Get ready!`, {
              position: "top-center",
            });
          }, timeUntilStart - 5 * 60 * 1000);
        }
      });
    };

    checkForUpcomingTasks();
    const interval = setInterval(checkForUpcomingTasks, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const formatTime = (seconds: number) => {
    const units = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "w", seconds: 604800 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
      { label: "s", seconds: 1 },
    ];
    const parts: string[] = [];
    for (const unit of units) {
      const value = Math.floor(seconds / unit.seconds);
      if (value > 0 || parts.length > 0 || unit.label === "s") {
        parts.push(`${value}${unit.label}`);
        seconds %= unit.seconds;
      }
    }
    return parts.join(" ");
  };

  // mark a task as expired locally + call API once
  const expireTask = async (taskId: number) => {
    if (expiredCalledRef.current[taskId]) return;
    expiredCalledRef.current[taskId] = true;

    if (intervalsRef.current[taskId]) {
      clearInterval(intervalsRef.current[taskId]);
      delete intervalsRef.current[taskId];
    }
    if (longTaskTimers.current[taskId]) {
      clearTimeout(longTaskTimers.current[taskId]);
      delete longTaskTimers.current[taskId];
    }

    setExpiredTasks((e) => ({ ...e, [taskId]: true }));
    setActiveTimers((prev) => {
      const { [taskId]: _omit, ...rest } = prev;
      return rest;
    });

    const t = tasks.find((x) => x.id === taskId);
    if (t?.serverId) {
      try {
        await updateExpiredTask(t.serverId);
      } catch (err) {
        console.error("updateExpiredTask error:", err);
      }
    }
  };

  const handleStartCountdown = (
    taskId: number,
    endMsParam: number | null,
    remainingSecondsOverride: number | null = null
  ) => {
    clearInterval(intervalsRef.current[taskId]);
    if (longTaskTimers.current[taskId]) {
      clearTimeout(longTaskTimers.current[taskId]);
      delete longTaskTimers.current[taskId];
    }

    const endMs = endMsParam ?? tasks.find((t) => t.id === taskId)?.endMs ?? 0;

    const initialRemaining =
      remainingSecondsOverride !== null
        ? remainingSecondsOverride
        : Math.floor((endMs - Date.now()) / 1000);

    setActiveTimers((prev) => ({ ...prev, [taskId]: initialRemaining }));
    setTaskStartTimes((prev) => ({ ...prev, [taskId]: Date.now() }));

    longTaskTimers.current[taskId] = setTimeout(() => {
      const task = tasks.find((t) => t.id === taskId);
      if (task && !pausedTimers[taskId] && !completedTasks[taskId]) {
        toast.warning(
          `You've been on "${task.taskName}" for 3 hours. Take a short break.`,
          { position: "top-center" }
        );
      }
    }, 3 * 60 * 60 * 1000);

    intervalsRef.current[taskId] = setInterval(() => {
      setActiveTimers((prev) => {
        const newRemaining = (prev[taskId] || 0) - 1;
        if (newRemaining <= 0) {
          clearInterval(intervalsRef.current[taskId]);
          setTimeout(() => expireTask(taskId), 0);
          const { [taskId]: _omit, ...rest } = prev;
          return rest;
        }
        return { ...prev, [taskId]: newRemaining };
      });
    }, 1000);
  };

  const handleTogglePause = (taskId: number) => {
    const isNowPaused = !pausedTimers[taskId];
    setPausedTimers((prev) => ({ ...prev, [taskId]: isNowPaused }));

    if (isNowPaused) {
      clearInterval(intervalsRef.current[taskId]);
      if (longTaskTimers.current[taskId]) {
        clearTimeout(longTaskTimers.current[taskId]);
        delete longTaskTimers.current[taskId];
      }
      setRemainingTimes((prev) => ({
        ...prev,
        [taskId]: activeTimers[taskId],
      }));
    } else {
      const remaining = remainingTimes[taskId];
      if (remaining > 0) handleStartCountdown(taskId, null, remaining);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    clearInterval(intervalsRef.current[taskId]);

    const task = tasks.find((t) => t.id === taskId)!;
    const startMs = taskStartTimes[taskId] || task.startMs;
    const timeSpentSeconds = Math.floor((Date.now() - startMs) / 1000);

    // optimistic
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completionTime: timeSpentSeconds } : t
      )
    );
    setCompletedTasks((prev) => ({ ...prev, [taskId]: true }));
    setCompletedCount((prev) => prev + 1);
    setActiveTimers((prev) => {
      const { [taskId]: _omit, ...rest } = prev;
      return rest;
    });

    try {
      const idForApi = task.serverId ?? String(task.id);
      const payload = buildCompletePayload(timeSpentSeconds);
      await completeTask(idForApi, payload);
    } catch (err) {
      console.error("completeTask error:", err);
      toast.error("Failed to sync completion. Saved locally.");
    }

    setActivities((prev) =>
      [
        {
          id: taskId,
          taskName: task.taskName,
          priority: task.priority,
          action: "Completed",
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, 5)
    );

    toast.success(`Completed "${task.taskName}"`);
  };

  const handleDeleteTask = async (taskId: number) => {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;

    if (t.serverId) {
      try {
        await deleteTaskApi(t.serverId);
        toast.success("Task deleted");
      } catch (e: any) {
        console.error("deleteTask error:", e);
        toast.error(e?.message || "Failed to delete task");
        return;
      }
    } else {
      toast("Removed local task", { icon: "🗑️" });
    }

    clearInterval(intervalsRef.current[taskId]);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setActiveTimers((prev) => {
      const updated: Record<number, number> = { ...prev };
      delete updated[taskId];
      return updated;
    });
    setPausedTimers((prev) => {
      const updated: Record<number, boolean> = { ...prev };
      delete updated[taskId];
      return updated;
    });
    setCompletedTasks((prev) => {
      const updated: Record<number, boolean> = { ...prev };
      delete updated[taskId];
      return updated;
    });
    setExpiredTasks((prev) => {
      const updated: Record<number, boolean> = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  // Auto-start timers + auto-expire if end has passed without a timer
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        const now = Date.now();
        const taskId = task.id;
        const start = task.startMs;
        const end = task.endMs;

        if (
          now >= start &&
          now < end &&
          activeTimers[taskId] === undefined &&
          !pausedTimers[taskId] &&
          !completedTasks[taskId] &&
          !expiredTasks[taskId]
        ) {
          const remaining = Math.floor((end - now) / 1000);
          handleStartCountdown(taskId, end, remaining);
        } else if (
          now >= end &&
          !completedTasks[taskId] &&
          !expiredTasks[taskId] &&
          !expiredCalledRef.current[taskId]
        ) {
          expireTask(taskId);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, activeTimers, pausedTimers, completedTasks, expiredTasks]);

  const [formData, setFormData] = useState({
    taskName: "",
    category: "",
    startTime: "",
    endTime: "",
    priority: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startMs = parseDateToMs(formData.startTime);
    const endMs = parseDateToMs(formData.endTime);
    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      toast.error("Please provide valid start and end times.");
      return;
    }
    if (endMs <= startMs) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const payload = {
        title: formData.taskName,
        startDate: ensureSeconds(formData.startTime),
        category: formData.category,
        priority: formData.priority,
        endDate: ensureSeconds(formData.endTime),
      };

      const apiRes = await createTask(payload as any);

      const serverId: string | undefined =
        apiRes?.data?.id ??
        apiRes?.data?._id ??
        apiRes?.id ??
        apiRes?._id ??
        apiRes?.taskId;

      const newTask: Task = {
        id: Date.now(),
        serverId,
        taskName: formData.taskName,
        category: formData.category,
        startTime: formData.startTime, // original
        endTime: formData.endTime, // original
        startMs,
        endMs,
        priority: formData.priority,
      };
      setTasks((prev) => [...prev, newTask]);

      setFormData({
        taskName: "",
        category: "",
        startTime: "",
        endTime: "",
        priority: "",
      });

      setSubmitSuccess(true);
      toast.success("Task created");
      setTimeout(() => {
        setShowTaskModal(false);
        setSubmitSuccess(false);
      }, 600);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Palette tuned to blue/indigo theme ---
  const badgeClass = (priority: string) => {
    if (priority === "High") return "bg-blue-100 text-blue-700";
    if (priority === "Medium") return "bg-indigo-100 text-indigo-700";
    if (priority === "Low") return "bg-sky-100 text-sky-700";
    return "bg-slate-100 text-slate-700";
  };

  const panelTint = (priority: string) => {
    if (priority === "High") return "bg-white border border-blue-200";
    if (priority === "Medium") return "bg-white border border-indigo-200";
    if (priority === "Low") return "bg-white border border-slate-200";
    return "bg-white border border-slate-200";
  };

  const pendingCount = tasks.filter(
    (task) => !completedTasks[task.id] && !expiredTasks[task.id]
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">My Tasks</h2>
            <p className="text-muted-foreground mt-2">
              Manage your daily tasks and boost productivity
            </p>
          </div>
          <Button
            onClick={() => setShowTaskModal(true)}
            className="px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            + New Task
          </Button>
        </div>

        {/* Top KPIs (full width) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{completedCount}</div>
              <Badge variant="outline" className="gap-1">
                <Check className="h-4 w-4" />
                Done
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{pendingCount}</div>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-4 w-4" />
                Waiting
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main content: 2/3 tasks + 1/3 sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tasks (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {[...tasks]
              .sort((a, b) => {
                const order: Record<string, number> = {
                  High: 1,
                  Medium: 2,
                  Low: 3,
                };
                return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
              })
              .map((task) => {
                const isDone = !!completedTasks[task.id];
                const isExpired = !!expiredTasks[task.id];

                return (
                  <Card
                    key={task.id}
                    className={`transition-shadow hover:shadow-lg ${panelTint(
                      task.priority
                    )}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">
                              {task.taskName}
                            </h3>
                            <Badge className={badgeClass(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {task.category}
                          </p>

                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                Start: {formatLocalNoSeconds(task.startMs)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarDays className="h-4 w-4" />
                              <span className="font-medium">
                                End: {formatLocalNoSeconds(task.endMs)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-3">
                          {isDone ? (
                            <>
                              <Badge
                                variant="secondary"
                                className="text-green-700 bg-green-100"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Task Completed
                              </Badge>
                              <div className="flex items-center gap-2">
                                <IconDeleteButton
                                  onClick={() => handleDeleteTask(task.id)}
                                />
                              </div>
                            </>
                          ) : isExpired ? (
                            <>
                              <Badge
                                variant="secondary"
                                className="text-red-700 bg-red-100"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Task Expired
                              </Badge>
                              <div className="flex items-center gap-2">
                                <IconDeleteButton
                                  onClick={() => handleDeleteTask(task.id)}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className={`text-base px-3 py-1 rounded-full ${badgeClass(
                                  task.priority
                                )}`}
                              >
                                {activeTimers[task.id] !== undefined
                                  ? formatTime(activeTimers[task.id])
                                  : "⏱ Ready"}
                              </Badge>

                              {activeTimers[task.id] !== undefined ? (
                                <div className="flex gap-2 items-center">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleTogglePause(task.id)}
                                    className="gap-1"
                                  >
                                    {pausedTimers[task.id] ? (
                                      <>
                                        <Play className="h-4 w-4" />
                                        Resume
                                      </>
                                    ) : (
                                      <>
                                        <Pause className="h-4 w-4" />
                                        Pause
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleCompleteTask(task.id)}
                                    className="gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4" />
                                    Complete
                                  </Button>

                                  <IconDeleteButton
                                    onClick={() => handleDeleteTask(task.id)}
                                  />
                                </div>
                              ) : (
                                <div className="flex gap-2 items-center justify-end">
                                  <IconDeleteButton
                                    onClick={() => handleDeleteTask(task.id)}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Right: Sidebar (1/3) */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 h-fit">
            {/* Lofi Player */}
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow">
                      <FiMusic className="h-5 w-5 text-indigo-600" />
                    </span>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Lofi Focus (hip-hop)
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Ambient beats to keep you in the zone 🎧
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    Live stream
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="rounded-xl overflow-hidden border bg-white/60 backdrop-blur">
                  <div className="relative w-full aspect-video">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src="https://www.youtube.com/embed/jfKfPfyJRdk?si=a0A3Q-Bh_YXti_JL"
                      title="Lofi hip hop radio — beats to relax/study to"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Create Task Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          {isSubmitting || submitSuccess ? (
            <div className="flex flex-col items-center justify-center p-8">
              {submitSuccess ? (
                <>
                  <div className="mb-4 rounded-full bg-green-100 p-4">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    Task Added Successfully!
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 rounded-full bg-blue-100 p-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    Adding task...
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    name="taskName"
                    placeholder="Enter task name"
                    value={formData.taskName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, category: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self Improvement">
                        Self Improvement
                      </SelectItem>
                      <SelectItem value="Workout">Workout</SelectItem>
                      <SelectItem value="Extra Curricular">
                        Extra Curricular
                      </SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        formData.priority === "High" ? "default" : "outline"
                      }
                      className={
                        formData.priority === "High"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : ""
                      }
                      onClick={() =>
                        setFormData((p) => ({ ...p, priority: "High" }))
                      }
                    >
                      High
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.priority === "Medium" ? "default" : "outline"
                      }
                      className={
                        formData.priority === "Medium"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : ""
                      }
                      onClick={() =>
                        setFormData((p) => ({ ...p, priority: "Medium" }))
                      }
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.priority === "Low" ? "default" : "outline"
                      }
                      className={
                        formData.priority === "Low"
                          ? "bg-sky-600 hover:bg-sky-700"
                          : ""
                      }
                      onClick={() =>
                        setFormData((p) => ({ ...p, priority: "Low" }))
                      }
                    >
                      Low
                    </Button>
                  </div>
                </div>

                <Separator />

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Add Task"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
